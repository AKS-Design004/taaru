package com.taaru.api.web;

import com.taaru.common.dto.ApiResponse;
import com.taaru.provider.domain.dto.CategoryResponse;
import com.taaru.provider.domain.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final CategoryRepository categoryRepository;

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories(
            @RequestParam(required = false) UUID parentId) {
        var categories = categoryRepository.findByParentIsNullOrderByDisplayOrder()
                .stream()
                .map(CategoryResponse::from)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(categories));
    }
}
