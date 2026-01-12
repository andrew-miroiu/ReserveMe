package com.example.demo.reservation;

import java.time.LocalDateTime;
import java.util.UUID;
import java.time.OffsetDateTime;

public class Reservation {
    private UUID id;
    private UUID userId;
    private UUID spaceId;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private OffsetDateTime createdAt;
    private String notes;


    public Reservation() {
    }

    public Reservation(UUID id, UUID userId, UUID spaceId, OffsetDateTime startTime, 
                      OffsetDateTime endTime, String notes, OffsetDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.spaceId = spaceId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getSpaceId() {
        return spaceId;
    }

    public void setSpaceId(UUID spaceId) {
        this.spaceId = spaceId;
    }

    public OffsetDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(OffsetDateTime startTime) {
        this.startTime = startTime;
    }

    public OffsetDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(OffsetDateTime endTime) {
        this.endTime = endTime;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
