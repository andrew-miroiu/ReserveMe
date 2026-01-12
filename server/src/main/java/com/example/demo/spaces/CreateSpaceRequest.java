package com.example.demo.spaces;

public class CreateSpaceRequest {
    private String name;
    private String type;
    private Integer capacity;
    private String location;
    private String equipment;
    private Boolean available;

    public CreateSpaceRequest() {
    }

    public CreateSpaceRequest(String name, String type, Integer capacity, String location, 
                             String equipment, Boolean available) {
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.location = location;
        this.equipment = equipment;
        this.available = available;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEquipment() {
        return equipment;
    }

    public void setEquipment(String equipment) {
        this.equipment = equipment;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}
