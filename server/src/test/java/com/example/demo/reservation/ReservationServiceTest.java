package com.example.demo.reservation;

import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;

class ReservationServiceTest {

    @Test
    void getFutureReservationsForUser_shouldThrowException_whenNoBackendAvailable() {
        ReservationService service = new ReservationService();

        UUID userId = UUID.randomUUID();

        assertThrows(RuntimeException.class, () -> {
            service.getFutureReservationsForUser(userId);
        });
    }

    @Test
    void getReservationsForDate_shouldThrowException_whenNoBackendAvailable() {
        ReservationService service = new ReservationService();

        UUID spaceId = UUID.randomUUID();
        String date = "2026-01-13";

        assertThrows(RuntimeException.class, () -> {
            service.getReservationsForDate(spaceId, date);
        });
    }

    @Test
    void createReservation_shouldThrowExceptionOnInvalidInput() {
        ReservationService service = new ReservationService();

        CreateReservationRequest request = new CreateReservationRequest();

        assertThrows(RuntimeException.class, () -> {
            service.createReservation(request);
        });
    }
}
