package com.taaru.common.port;

import java.io.InputStream;

public interface IMediaPort {
    String upload(String bucket, String key, InputStream data, String contentType, long size);
    void delete(String bucket, String key);
    String generatePresignedUrl(String bucket, String key, int expiryInSeconds);
}
