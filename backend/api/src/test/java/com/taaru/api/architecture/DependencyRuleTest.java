package com.taaru.api.architecture;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.*;

public class DependencyRuleTest {

    private static JavaClasses classes;

    @BeforeAll
    static void importClasses() {
        classes = new ClassFileImporter().importPackages("com.taaru");
    }

    @Test
    void bookingModuleShouldOnlyDependOnCommon() {
        ArchRule rule = noClasses()
                .that().resideInAPackage("com.taaru.booking..")
                .should().dependOnClassesThat().resideInAnyPackage(
                        "com.taaru.auth..",
                        "com.taaru.provider..",
                        "com.taaru.payment..",
                        "com.taaru.messaging..",
                        "com.taaru.notification..",
                        "com.taaru.search..",
                        "com.taaru.review..",
                        "com.taaru.admin..",
                        "com.taaru.api.."
                );
        rule.check(classes);
    }

    @Test
    void paymentModuleShouldOnlyDependOnCommon() {
        ArchRule rule = noClasses()
                .that().resideInAPackage("com.taaru.payment..")
                .should().dependOnClassesThat().resideInAnyPackage(
                        "com.taaru.auth..",
                        "com.taaru.provider..",
                        "com.taaru.booking..",
                        "com.taaru.messaging..",
                        "com.taaru.notification..",
                        "com.taaru.search..",
                        "com.taaru.review..",
                        "com.taaru.admin..",
                        "com.taaru.api.."
                );
        rule.check(classes);
    }

    @Test
    void messagingModuleShouldOnlyDependOnCommon() {
        ArchRule rule = noClasses()
                .that().resideInAPackage("com.taaru.messaging..")
                .should().dependOnClassesThat().resideInAnyPackage(
                        "com.taaru.auth..",
                        "com.taaru.provider..",
                        "com.taaru.booking..",
                        "com.taaru.payment..",
                        "com.taaru.notification..",
                        "com.taaru.search..",
                        "com.taaru.review..",
                        "com.taaru.admin..",
                        "com.taaru.api.."
                );
        rule.check(classes);
    }

    @Test
    void notificationModuleShouldOnlyDependOnCommon() {
        ArchRule rule = noClasses()
                .that().resideInAPackage("com.taaru.notification..")
                .should().dependOnClassesThat().resideInAnyPackage(
                        "com.taaru.auth..",
                        "com.taaru.provider..",
                        "com.taaru.booking..",
                        "com.taaru.payment..",
                        "com.taaru.messaging..",
                        "com.taaru.search..",
                        "com.taaru.review..",
                        "com.taaru.admin..",
                        "com.taaru.api.."
                );
        rule.check(classes);
    }

    @Test
    void searchModuleShouldOnlyDependOnCommon() {
        ArchRule rule = noClasses()
                .that().resideInAPackage("com.taaru.search..")
                .should().dependOnClassesThat().resideInAnyPackage(
                        "com.taaru.auth..",
                        "com.taaru.provider..",
                        "com.taaru.booking..",
                        "com.taaru.payment..",
                        "com.taaru.messaging..",
                        "com.taaru.notification..",
                        "com.taaru.review..",
                        "com.taaru.admin..",
                        "com.taaru.api.."
                );
        rule.check(classes);
    }

    @Test
    void reviewModuleShouldOnlyDependOnCommon() {
        ArchRule rule = noClasses()
                .that().resideInAPackage("com.taaru.review..")
                .should().dependOnClassesThat().resideInAnyPackage(
                        "com.taaru.auth..",
                        "com.taaru.provider..",
                        "com.taaru.booking..",
                        "com.taaru.payment..",
                        "com.taaru.messaging..",
                        "com.taaru.notification..",
                        "com.taaru.search..",
                        "com.taaru.admin..",
                        "com.taaru.api.."
                );
        rule.check(classes);
    }

    @Test
    void authModuleShouldOnlyDependOnCommon() {
        ArchRule rule = noClasses()
                .that().resideInAPackage("com.taaru.auth..")
                .should().dependOnClassesThat().resideInAnyPackage(
                        "com.taaru.provider..",
                        "com.taaru.booking..",
                        "com.taaru.payment..",
                        "com.taaru.messaging..",
                        "com.taaru.notification..",
                        "com.taaru.search..",
                        "com.taaru.review..",
                        "com.taaru.admin..",
                        "com.taaru.api.."
                );
        rule.check(classes);
    }

    @Test
    void providerModuleShouldOnlyDependOnCommonAndAuth() {
        ArchRule rule = noClasses()
                .that().resideInAPackage("com.taaru.provider..")
                .should().dependOnClassesThat().resideInAnyPackage(
                        "com.taaru.booking..",
                        "com.taaru.payment..",
                        "com.taaru.messaging..",
                        "com.taaru.notification..",
                        "com.taaru.search..",
                        "com.taaru.review..",
                        "com.taaru.admin..",
                        "com.taaru.api.."
                );
        rule.check(classes);
    }

    @Test
    void adminModuleMayDependOnAllOtherModules() {
        ArchRule rule = classes()
                .that().resideInAPackage("com.taaru.admin..")
                .should().onlyDependOnClassesThat().resideInAnyPackage(
                        "com.taaru.common..",
                        "com.taaru.auth..",
                        "com.taaru.provider..",
                        "com.taaru.booking..",
                        "com.taaru.payment..",
                        "com.taaru.messaging..",
                        "com.taaru.notification..",
                        "com.taaru.search..",
                        "com.taaru.review..",
                        "com.taaru.admin..",
                        "java..",
                        "org.springframework..",
                        "org.slf4j..",
                        "lombok..",
                        "jakarta..",
                        "com.fasterxml.jackson.."
                );
        rule.check(classes);
    }

    @Test
    void noModuleShouldDependOnApiModule() {
        ArchRule rule = noClasses()
                .that().resideOutsideOfPackage("com.taaru.api..")
                .should().dependOnClassesThat().resideInAPackage("com.taaru.api..");
        rule.check(classes);
    }

    @Test
    void noModuleShouldDependOnAdminModule() {
        ArchRule rule = noClasses()
                .that().resideOutsideOfPackages("com.taaru.admin..", "com.taaru.api..")
                .should().dependOnClassesThat().resideInAPackage("com.taaru.admin..");
        rule.check(classes);
    }
}
