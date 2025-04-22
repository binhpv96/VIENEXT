package com.vienext.userservice.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Arrays;
import java.util.List;

public enum SubscriptionPlan {
    FREE(
            "FREE",
            Arrays.asList(
                    "VIEW_CONTENT" // Chỉ được xem nội dung cơ bản
            )
    ),
    PREMIUM(
            "PREMIUM",
            Arrays.asList(
                    "VIEW_CONTENT",
                    "CUSTOMIZE_UI", // Custom giao diện
                    "CREATE_MEETING", // Tạo cuộc họp (giới hạn 5/tháng)
                    "JOIN_MEETING"
            )
    ),
    ENTERPRISE(
            "ENTERPRISE",
            Arrays.asList(
                    "VIEW_CONTENT",
                    "CUSTOMIZE_UI",
                    "CREATE_MEETING", // Không giới hạn số cuộc họp
                    "JOIN_MEETING",
                    "PRIORITY_SUPPORT" // Hỗ trợ ưu tiên
            )
    );

    private final String planName;
    private final List<String> permissions;

    SubscriptionPlan(String planName, List<String> permissions) {
        this.planName = planName;
        this.permissions = permissions;
    }

    public String getPlanName() {
        return planName;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public boolean hasPermission(String permission) {
        return permissions.contains(permission);
    }
}
