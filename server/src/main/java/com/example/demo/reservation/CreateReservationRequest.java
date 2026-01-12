package com.example.demo.reservation;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.UUID;
import java.time.OffsetDateTime;

public class CreateReservationRequest {
    private UUID userId;
    private UUID spaceId;
    
     private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    
    private String notes;

    public CreateReservationRequest() {
    }

    public CreateReservationRequest(UUID userId, UUID spaceId, OffsetDateTime startTime, 
                                   OffsetDateTime endTime, String notes) {
        this.userId = userId;
        this.spaceId = spaceId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.notes = notes;
    }

    // Getters and Setters
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
}
