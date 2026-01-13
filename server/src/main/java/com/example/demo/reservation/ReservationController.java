package com.example.demo.reservation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createReservation(@RequestBody CreateReservationRequest request) {
        try {
            // Validate required fields
            if (request.getUserId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is required");
            }
            if (request.getSpaceId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Space ID is required");
            }
            if (request.getStartTime() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Start time is required");
            }
            if (request.getEndTime() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("End time is required");
            }

            Reservation createdReservation = reservationService.createReservation(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReservation);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error creating reservation: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("Caused by: " + e.getCause().getMessage());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/by-date")
    public ResponseEntity<?> getReservationsByDate(
            @RequestParam UUID spaceId,
            @RequestParam String date // yyyy-MM-dd
    ) {
        try {
            return ResponseEntity.ok(
                    reservationService.getReservationsForDate(spaceId, date)
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching reservations: " + e.getMessage());
        }
    }

    @GetMapping("/my-reservations")
    public ResponseEntity<?> getMyFutureReservations(@RequestParam UUID userId) {
        try {
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is required");
            }

            List<ReservationWithSpaceName> reservations = reservationService.getFutureReservationsForUser(userId);
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching user's future reservations: " + e.getMessage());
        }
    }



}
