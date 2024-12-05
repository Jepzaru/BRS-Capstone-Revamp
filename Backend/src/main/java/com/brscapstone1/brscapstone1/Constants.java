package com.brscapstone1.brscapstone1;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Constants {
    public static class ApiRoutes{
        // PLAIN ROUTES
        public static final String GET_ALL = "/getAll";
        public static final String POST = "/post";
        public static final String DELETE = "/delete/{id}";
        public static final String UPDATE = "/update/{id}";

        // DEPARTMENT ROUTES
        public static final String DEPARTMENT_BASE = "/department";
        public static final String DRIVER_BASE = "/opc/driver";
        public static final String DRIVER_UPDATE_STATUS = "/update-status";

        // EVENT ROUTES
        public static final String EVENT_BASE = "/opc/events";
        public static final String EVENT_BY_DATE = "/date/{date}";

        // FILE ROUTES
        public static final String FILE_BASE = "/file";
        public static final String FILE_POST = "/add";
        public static final String FILE_GET = "/all-files";

        // RESERVATION ROUTES
        public static final String APPROVED_BY_HEAD = "/user/reservations/head-approve/{reservationId}";
        public static final String APPROVED_BY_OPC = "/user/reservations/opc-approve/{reservationId}";
        public static final String ASSIGN_DRIVER = "/user/reservations/assign-driver/{reservationId}/{plateNumber}";
        public static final String REJECT_RESERVATION = "/user/reservations/reject/{reservationId}";
        public static final String ADD_RESERVATION = "/user/reservations/add";
        public static final String GET_ALL_RESERVATION = "/reservations/getAll";
        public static final String GET_BY_ID_RESERVATION = "/user/reservations/id/{id}";
        public static final String GET_BY_USER_RESERVATION = "/user/reservations/{userName}";
        public static final String UPDATE_ASSIGNED_DRIVER = "/user/reservations/update-driver/{reservationId}";
        public static final String UPDATE_RESERVATION = "/reservations/update/{reservationId}";
        public static final String GET_OPC_APPROVED = "/reservations/opc-approved";
        public static final String GET_HEAD_APPROVED = "/reservations/head-approved";
        public static final String VEHICLE_AVAILABILITY = "/reservations/vehicle-availability";
        public static final String MULTIPLE_VEHICLE_AVAILABILITY = "/reservations/multiple-vehicle-availability";
        public static final String SINGLE_RESERVED_DATE_AND_TIME = "/reservations/by-plate-and-date";
        public static final String MULTIPLE_RESERVED_DATE_AND_TIME = "multiple/reservations/by-plate-and-date";
        public static final String DELETE_RESERVATION = "/reservations/delete/{id}";
        public static final String PMULTIPLE_PLATE_NUMBER = "/reservations/multiple-reserved/plate-numbers";
        public static final String MAIN_PLATE_NUMBER = "/reservations/main-plate-numbers";
        public static final String RESEND_RESERVATION = "reservations/resend/{reservationId}";
        public static final String COMPLETE_RESERVATION = "/user/reservations/complete/{reservationId}";
        public static final String CANCEL_RESERVATION = "/user/reservation/cancel/{reservationId}";

        // USER ROUTES
        public static final String AUTHENTICATE = "/authenticate";
        public static final String GET_BY_ID_USER = "/users/{id}";
        public static final String POST_USER = "/admin/users/add";
        public static final String GET_USER = "/admin/users/read";
        public static final String UPDATE_USER = "/admin/users/update/{id}";
        public static final String DELETE_USER = "/admin/users/delete/{id}";
        public static final String CHANGE_PASS_USER = "/users/change-password/{id}";
        public static final String UPLOAD_PROFILE_USER = "/users/upload-profile-pic/{id}";
        public static final String GET_PROFILE_USER = "/users/profile-pic/{id}";
        public static final String UPDATE_PROFILE_USER = "/users/update-profile-pic/{id}";

        // VEHICLE ROUTES
        public static final String POST_VEHICLE = "/opc/vehicle/post";
        public static final String GET_ALL_VEHICLE = "/vehicle/getAll";
        public static final String UPDATE_VEHICLE = "/opc/vehicle/update/{id}";
        public static final String DELETE_VEHICLE = "/opc/vehicle/delete/{id}";
        public static final String VEHICLE_MAINTENANCE_DETAILS = "/opc/vehicle/maintenance-details";
        public static final String VEHICLE_MAINTENANCE_STATUS = "/opc/vehicle/maintenance-status/{id}";

        // EMAIL
        public static final String EMAIL_BASE = "/api/email";
        public static final String EMAIL_POST = "/send";
        public static final String EMAIL_VERIFY = "/verify";
        public static final String CHANGE_PASS_USER_BY_EMAIL = "/change-password-by-email";
    }

    public static class ResponseKeys{
        public static final String OLD_PASSWORD = "oldPassword";
        public static final String NEW_PASSWORD = "newPassword";
        public static final String TOKEN = "token";
        public static final String ROLE = "role";
        public static final String EMAIL = "email";
        public static final String DEPARTMENT = "department";
        public static final String USER_ID = "userId";
    }

    public static class ResponseMessages{
        // SUCCESS RESPONSE MESSAGES
        public static final String HEAD_APPROVED_SUCCESS = "Reservation approved by Head of the Department successfully";
        public static final String OPC_APPROVED_SUCCESS = "Reservation approved by OPC successfully";
        public static final String RESERVATION_COMPLETE_SUCCESS = "Reservation completed successfully: ";
        public static final String RESERVATION_CANCEL_SUCCESS = "Reservation canceled successfully: ";
        public static final String DRIVER_ASSIGN_SUCCESS = "Driver assigned successfully";
        public static final String RESERVATION_REJECT_SUCCESS = "Reservation rejected successfully";
        public static final String DRIVER_ASSIGN_UPDATE_SUCCESS = "Assigned driver updated successfully";
        public static final String GET_DATE_SUCCESS = "Received date string: ";

        public static final String DEPARTMENT_DELETE_SUCCESS = "Department with id {0} is successfully deleted.";
        public static final String DRIVER_DELETE_SUCCESS = "Driver with id {0} successfully deleted.";
        public static final String EVENT_DELETE_SUCCESS = "Event with id {0} successfully deleted (soft).";
        public static final String EVENT_DELETE_ERROR = "Event with id {0} was already deleted.";
        public static final String RESERVATION_DELETE_SUCCESS = "Reservation with id {0} successfully deleted.";
        public static final String VEHICLE_DELETE_SUCCESS = "Vehicle with id {0} successfully deleted.";

        public static final String EMAIL_SUCCESS = "Email sent successfully";
        public static final String VERIFY_SUCCESS = "Code verified successfully.";
        public static final String USER_DELETE_SUCCESS = "User with id {0} successfully deleted";
        public static final String CHANGE_PASS_SUCCESS = "Password successfully changed";

        // FAILED RESPONSE MESSAGES
        public static final String INVALID_CREDENTIALS = "Invalid Credentials";
        public static final String INVALID_RESERVATION = "Failed to approve reservation: ";
        public static final String INVALID_DRIVER_ASSIGNMENT = "Failed to assign driver: ";
        public static final String INVALID_RESERVATION_REJECTION = "Failed to reject reservation: ";
        public static final String INVALID_ASSIGN_DRIVER_UPDATE = "Failed to update assigned driver: ";
        public static final String NOT_FOUND_RESERVATION = "Reservation not found: ";
        public static final String INVALID_COMPELTE_RESERVATION = "Failed to complete reservation: ";
        public static final String INVALID_DATE_FORMAT = "Invalid date format: ";

        public static final String DEPARTMENT_DELETE_FAILED = "Department with id {0} does not exists.";
        public static final String DRIVER_NOT_EXISTS = "Driver with id {0} does not exists.";
        public static final String EVENT_NOT_EXISTS = "Event with id {0} does not exists.";
        public static final String RESERVATION_NOT_EXISTS = "Reservation with id {0} does not exists.";

        public static final String EMAIL_FAILED = "Failed to send email: {}";
        public static final String EMAIL_BODY_FAILED = "Error sending email: ";

        public static final String VERIFY_FAILED = "Invalid verification code";
        public static final String VERIFY_BODY_FAILED = "Verification failed: {}";
        public static final String VERIFY_ERROR = "Error verifiying code: ";

        public static final String OLD_PASS_INCORRECT = "Old password is incorrect";
    }

    public static class Annotation{
        // REQUEST PARAM
        public static final String USERNAME = "userName";
        public static final String FILE_URLS = "fileUrl";
        public static final String RESERVATION = "reservation";
        public static final String VEHICLE_ID = "vehicleIds";
        public static final String FILE = "file";
        public static final String RESENDING = "isResending";
        public static final String EMAIL = "email";
        public static final String CODE = "code";

        // PARAM
        public static final String TODAY = "today";
        public static final String PLATENUMBER = "plateNumber";
        public static final String RESERVATION_ID = "reservationId";
        public static final String SCHEDULE = "schedule";
        public static final String RETURN_SCHEDULE = "returnSchedule";

        // PATH VARIABLE
        public static final String ID = "id";
        public static final String DATE = "date";

        // DEFAULT VALUES
        public static final String FALSE = "false";
        public static final String APPROVED = "Approved";
        public static final String AVAILABLE = "Available";
        public static final String REJECTED = "Rejected";
        public static final String PENDING = "Pending";
        public static final String COMPLETED = "Completed";
        public static final String CANCELED = "Canceled";
        public static final String MAINTENANCE = "Maintenance";
        public static final String NO_FEEDBACK = "No feedback";
        public static final String NO_FILE = "No file(s) attached";
        public static final String NO_DRIVER = "No driver assigned";
        public static final String OPC = "OPC";
        public static final String HEAD = "Head";
    }

    public static class DataAnnotations{
        public static final String DATE_FORMAT = "yyyy-MM-dd";
        public static final String DEPARTMENT = "department";
        public static final String DRIVER = "drivers";
        public static final String EVENT = "events";
        public static final String EVENT_DATE = "event_date";
        public static final String EVENT_DESCRIPTION = "event_description";
        public static final String EVENT_TITLE = "event_title";
        public static final String IS_DELETED = "is_deleted";
        public static final String RESERVATION = "reservation";
        public static final String RESERVATION_ID = "reservation_id";
        public static final String RESERVATION_VEHICLE = "reservation_vehicle";
        public static final String USER = "users";
        public static final String VEHICLE = "vehicle";
        public static final String VEHICLE_ID = "vehicle_id";
        public static final String VEHICLE_MAINTENANCE_DETAILS = "vehicle_maintenance_details";

        public static final String SPRING_EMAIL = "${spring.mail.username}";
    }

    public static class RepositoryQuery{
        // DRIVER
        public static final String DRIVER_ON_LEAVE = "SELECT d FROM DriverEntity d WHERE d.leaveEndDate IS NOT NULL AND d.leaveEndDate < :today";

        // RESERVATION
        public static final String FIND_MAIN_SCHEDULE_OR_RETURN = "SELECT r FROM ReservationEntity r WHERE r.schedule = :schedule OR r.returnSchedule = :returnSchedule";
        public static final String FIND_PLATENUMBER_AND_DATE = "SELECT r FROM ReservationEntity r WHERE r.plateNumber = :plateNumber AND (r.schedule = :date OR r.returnSchedule = :date)";

        // RESERVATION VEHICLE
        public static final String FIND_BY_PLATENUMBER = "SELECT rv FROM ReservationVehicleEntity rv WHERE rv.plateNumber = :plateNumber";
        public static final String FIND_BY_PLATENUMBER_SCHEDULE = "SELECT rv FROM ReservationVehicleEntity rv WHERE rv.plateNumber = :plateNumber AND (rv.schedule = :date OR rv.returnSchedule = :date)";
        public static final String FIND_RESERVATION_ID = "SELECT rv FROM ReservationVehicleEntity rv WHERE rv.reservation.id = :reservationId";
        public static final String FIND_RESERVATION_ID_AND_PLATENUMBER = "SELECT rv FROM ReservationVehicleEntity rv WHERE rv.reservation.id = :reservationId AND rv.plateNumber = :plateNumber";
        public static final String FIND_SCHEDULE_OR_RETURN_SCHEDULE = "SELECT rv FROM ReservationVehicleEntity rv WHERE (rv.schedule = :schedule OR rv.returnSchedule = :returnSchedule) AND rv.status = 'Approved'";
    }

    public static class ExceptionMessage{
        public static final String NO_ELEMENT_DEPARTMENT = "Department with id {0} does not exists";
        public static final String FILE_EMPTY = "File is empty";
        public static final String RESERVATION_NOT_FOUND = "Reservation not found";
        public static final String VEHICLE_NOT_FOUND = "Vehicle not found";
        public static final String VEHICLE_ID_NOT_FOUND = "Vehicle with id {0} does not exists";
        public static final String EMAIL_NOT_FONUD = "User with email {0} does not exists";
        public static final String USER_NOT_FOUND = "User with id {0} does not exists";
        public static final String USERNAME_NOT_FOUND = "User not found with email: ";
        public static final String MAINTENANCE_NOT_FOUND = "Maintenance record with id {0} does not exists";
        public static final String VEHICLE_ERROR_UPDATE = "Error updating vehicle";
    }

    public static class EmailConstants{
        public static final String PASSWORD_CHANGE_REQUEST_TEMPLATE = 
        "Hi {0},\n\n" +
        "We have received a password change request for your CITU-Move account.\n\n" +
        "This is your verification code: {1}\n\n" +
        "If you did not initiate this request, you can ignore this email. Your password will not be changed.\n\n\n" +
        "Thank you, \n" +
        "CITU-Move Team";
        
        public static final String EMAIL_SUBJECT = "Reset Password Requests (CIT-U Move)";
        public static final String EMAIL_SUCCESS = "Email send successfully to {}";
        public static final String EMAIL_FAILED = "Failed to send email: ";
        public static final String EMAIL_FAILED_LOGGER = "Error while sending email: {}";
    }

    public static class MagicNumbers{
        public static final LocalDate DEFAULT_DATE = LocalDate.of(1, 1, 1);
        public static final LocalDateTime DEFAULT_TIMESTAMP = LocalDateTime.of(1, 1, 1, 0, 0);
    }
}
