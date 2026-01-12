package com.example.demo.spaces;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class SpaceService {

    @Value("${supabase.url:https://xixyrulinzknlalfnagw.supabase.co}")
    private String supabaseUrl;

    @Value("${supabase.service-key:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpeHlydWxpbnprbmxhbGZuYWd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzc3NjgzNywiZXhwIjoyMDgzMzUyODM3fQ.SZp9l0QJPNPE4s1k0MlLcS3OJZDzpZfW8c7GbZG7Q_0}")
    private String supabaseServiceKey;

    @Value("${supabase.anon-key:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpeHlydWxpbnprbmxhbGZuYWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NzY4MzcsImV4cCI6MjA4MzM1MjgzN30.0DkIIuImHXCsZLnfsJcnF6nSoDLzTJNrJLQoRrbgmuA}")
    private String supabaseAnonKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public SpaceService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public List<Space> getAllSpaces() {
        try {
            String url = supabaseUrl + "/rest/v1/spaces?select=*";
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("apikey", supabaseAnonKey);
            headers.set("Authorization", "Bearer " + supabaseAnonKey);
            headers.set("Content-Type", "application/json");
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            List<Space> spaces = new ArrayList<>();
            
            if (jsonNode.isArray()) {
                for (JsonNode node : jsonNode) {
                    Space space = mapJsonToSpace(node);
                    spaces.add(space);
                }
            }
            
            return spaces;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching spaces from Supabase: " + e.getMessage());
        }
    }

    private Space mapJsonToSpace(JsonNode node) {
        Space space = new Space();
        
        if (node.has("id")) {
            space.setId(UUID.fromString(node.get("id").asText()));
        }
        if (node.has("name")) {
            space.setName(node.get("name").asText());
        }
        if (node.has("type")) {
            space.setType(node.get("type").asText());
        }
        if (node.has("capacity")) {
            space.setCapacity(node.get("capacity").asInt());
        }
        if (node.has("location")) {
            space.setLocation(node.get("location").asText());
        }
        if (node.has("equipment")) {
            space.setEquipment(node.get("equipment").asText());
        }
        if (node.has("available")) {
            space.setAvailable(node.get("available").asBoolean());
        }
        if (node.has("created_at")) {
            String createdAtStr = node.get("created_at").asText();
            space.setCreatedAt(parseDateTime(createdAtStr));
        }
        
        return space;
    }

    private LocalDateTime parseDateTime(String dateTimeStr) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            return LocalDateTime.parse(dateTimeStr.replace("Z", ""), formatter);
        } catch (Exception e) {
            return null;
        }
    }

    public Space createSpace(CreateSpaceRequest request) {
        try {
            String url = supabaseUrl + "/rest/v1/spaces?select=*";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("apikey", supabaseServiceKey);
            headers.set("Authorization", "Bearer " + supabaseServiceKey);
            headers.set("Prefer", "return=representation");
            
            // Build the request body as a Map
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("name", request.getName());
            requestBody.put("type", request.getType());
            requestBody.put("capacity", request.getCapacity());
            requestBody.put("location", request.getLocation());
            if (request.getEquipment() != null && !request.getEquipment().trim().isEmpty()) {
                requestBody.put("equipment", request.getEquipment().trim());
            }
            requestBody.put("available", request.getAvailable() != null ? request.getAvailable() : true);
            
            // Convert Map to JSON string
            String jsonBody = objectMapper.writeValueAsString(requestBody);
            System.out.println("Sending request to Supabase: " + url);
            System.out.println("Request body: " + jsonBody);
            
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            System.out.println("Response status: " + response.getStatusCode());
            System.out.println("Response body: " + response.getBody());
            
            // Parse the response
            String responseBody = response.getBody();
            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response from Supabase");
            }
            
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            if (jsonNode.isArray() && jsonNode.size() > 0) {
                return mapJsonToSpace(jsonNode.get(0));
            } else if (!jsonNode.isArray()) {
                return mapJsonToSpace(jsonNode);
            }
            
            throw new RuntimeException("Failed to create space - no data returned");
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            e.printStackTrace();
            String errorBody = e.getResponseBodyAsString();
            throw new RuntimeException("Supabase error (" + e.getStatusCode() + "): " + errorBody);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error creating space in Supabase: " + e.getMessage());
        }
    }

    public void deleteSpace(UUID id) {
        try {
            String url = supabaseUrl + "/rest/v1/spaces?id=eq." + id.toString();
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("apikey", supabaseServiceKey);
            headers.set("Authorization", "Bearer " + supabaseServiceKey);
            headers.set("Prefer", "return=minimal");
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);
            
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Failed to delete space - HTTP status: " + response.getStatusCode());
            }
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            e.printStackTrace();
            String errorBody = e.getResponseBodyAsString();
            throw new RuntimeException("Supabase error (" + e.getStatusCode() + "): " + errorBody);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error deleting space from Supabase: " + e.getMessage());
        }
    }
}
