package com.brscapstone1.brscapstone1.DTO;

public class EmailDetailsDTO {
    private String recipient;
    private String emailBody;
    private String emailSubject;
    private String code;

    public String getRecipient() {
        return recipient;
    }
    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getEmailBody() {
        return emailBody;
    }
    public void setEmailBody(String emailBody) {
        this.emailBody = emailBody;
    }

    public String getEmailSubject() {
        return emailSubject;
    }
    public void setEmailSubject(String emailSubject) {
        this.emailSubject = emailSubject;
    }
    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }
}
