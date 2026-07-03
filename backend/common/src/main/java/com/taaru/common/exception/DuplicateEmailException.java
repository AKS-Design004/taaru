package com.taaru.common.exception;

public class DuplicateEmailException extends BusinessException {
    public DuplicateEmailException() {
        super("DUPLICATE_EMAIL", "Cet email est déjà utilisé");
    }
}
