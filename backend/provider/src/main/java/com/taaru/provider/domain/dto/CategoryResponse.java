package com.taaru.provider.domain.dto;

import com.taaru.provider.domain.entity.Category;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record CategoryResponse(
        UUID id,
        String name,
        String slug,
        String description,
        List<CategoryResponse> children
) {
    public static CategoryResponse from(Category category) {
        var children = category.getChildren() != null
                ? category.getChildren().stream().map(CategoryResponse::from).toList()
                : List.<CategoryResponse>of();
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .children(children)
                .build();
    }
}
