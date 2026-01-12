package com.example.demo.reservation;

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
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class ReservationService {

    @Value("${supabase.url:https://xixyrulinzknlalfnagw.supabase.co}")
    private String supabaseUrl;

    @Value("${supabase.service-key:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpeHlydWxpbnprbmxhbGZuYWd3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzc3NjgzNywiZXhwIjoyMDgzMzUyODM3fQ.SZp9l0QJPNPE4s1k0MlLcS3OJZDzpZfW8c7GbZG7Q_0}")
    private String supabaseServiceKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public ReservationService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public Reservation createReservation(CreateReservationRequest request) {
        try {
            String url = supabaseUrl + "/rest/v1/reservations?select=*";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("apikey", supabaseServiceKey);
            headers.set("Authorization", "Bearer " + supabaseServiceKey);
            headers.set("Prefer", "return=representation");
            
            // Build the request body as a Map
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("user_id", request.getUserId().toString());
            requestBody.put("space_id", request.getSpaceId().toString());
            requestBody.put("start_time", request.getStartTime().toString());
            requestBody.put("end_time", request.getEndTime().toString());
            if (request.getNotes() != null && !request.getNotes().trim().isEmpty()) {
                requestBody.put("notes", request.getNotes().trim());
            }
            
            // Convert Map to JSON string
            String jsonBody = objectMapper.writeValueAsString(requestBody);
            
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            
            // Parse the response
            String responseBody = response.getBody();
            if (responseBody == null || responseBody.trim().isEmpty()) {
                throw new RuntimeException("Empty response from Supabase");
            }
            
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            if (jsonNode.isArray() && jsonNode.size() > 0) {
                return mapJsonToReservation(jsonNode.get(0));
            } else if (!jsonNode.isArray()) {
                return mapJsonToReservation(jsonNode);
            }
            
            throw new RuntimeException("Failed to create reservation - no data returned");
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            e.printStackTrace();
            String errorBody = e.getResponseBodyAsString();
            throw new RuntimeException("Supabase error (" + e.getStatusCode() + "): " + errorBody);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error creating reservation in Supabase: " + e.getMessage());
        }
    }

    private Reservation mapJsonToReservation(JsonNode node) {
        Reservation reservation = new Reservation();
        
        if (node.has("id")) {
            reservation.setId(UUID.fromString(node.get("id").asText()));
        }
        if (node.has("user_id")) {
            reservation.setUserId(UUID.fromString(node.get("user_id").asText()));
        }
        if (node.has("space_id")) {
            reservation.setSpaceId(UUID.fromString(node.get("space_id").asText()));
        }
        if (node.has("start_time")) {
            String startTimeStr = node.get("start_time").asText();
            reservation.setStartTime(parseDateTime(startTimeStr));
        }
        if (node.has("end_time")) {
            String endTimeStr = node.get("end_time").asText();
            reservation.setEndTime(parseDateTime(endTimeStr));
        }
        if (node.has("notes")) {
            reservation.setNotes(node.get("notes").asText());
        }
        if (node.has("created_at")) {
            String createdAtStr = node.get("created_at").asText();
            reservation.setCreatedAt(parseDateTime(createdAtStr));
        }
        
        return reservation;
    }

    private String formatDateTime(OffsetDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ISO_DATE_TIME);
    }

    private OffsetDateTime parseDateTime(String dateTimeStr) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            return OffsetDateTime.parse(dateTimeStr.replace("Z", ""), formatter);
        } catch (Exception e) {
            return null;
        }
    }
}
