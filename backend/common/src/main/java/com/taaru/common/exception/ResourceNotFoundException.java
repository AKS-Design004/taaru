package com.taaru.common.exception;

public class ResourceNotFoundException extends BusinessException {
    public ResourceNotFoundException(String resource) {
        super("NOT_FOUND", resource + " non trouvé");
    }

    public ResourceNotFoundException(String resource, Object id) {
        super("NOT_FOUND", resource + " non trouvé : " + id);
    }

    public ResourceNotFoundException(String code, String message) {
        super(code, message);
    }
}
