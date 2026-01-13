package com.example.demo.reservation;

import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ReservationsByDateRequestTest {

    @Test
    void shouldSetAndGetFieldsCorrectly() {
        UUID spaceId = UUID.randomUUID();
        LocalDate date = LocalDate.now();

        ReservationsByDateRequest request = new ReservationsByDateRequest();
        request.setSpaceId(spaceId);
        request.setDate(date);

        assertEquals(spaceId, request.getSpaceId());
        assertEquals(date, request.getDate());
    }
}
