package com.example.demo.reservation;

import java.time.LocalDate;
import java.util.UUID;

public class ReservationsByDateRequest {

    private UUID spaceId;
    private LocalDate date;

    public UUID getSpaceId() {
        return spaceId;
    }

    public void setSpaceId(UUID spaceId) {
        this.spaceId = spaceId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
