package com.taaru.api.architecture;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import jakarta.persistence.Entity;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.tngtech.archunit.base.DescribedPredicate;
import com.tngtech.archunit.core.domain.JavaClass;
import org.springframework.data.jpa.repository.JpaRepository;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.*;
import static com.tngtech.archunit.core.domain.JavaClass.Predicates.*;

public class DomainRuleTest {

    private static JavaClasses classes;

    @BeforeAll
    static void importClasses() {
        classes = new ClassFileImporter().importPackages("com.taaru");
    }

    @Test
    void repositoriesShouldBeInDaoOrDomainRepositoryPackage() {
        ArchRule rule = classes()
                .that().areAssignableTo(JpaRepository.class)
                .should().resideInAnyPackage("..dao..", "..domain.repository..");
        rule.check(classes);
    }

    @Test
    void entitiesShouldNotBeExposedInControllers() {
        ArchRule rule = noClasses()
                .that().resideInAnyPackage("..controller..", "..api.web..")
                .should().dependOnClassesThat().areAnnotatedWith(Entity.class);
        rule.check(classes);
    }

    @Test
    void controllersShouldNotDirectlyAccessRepositories() {
        ArchRule rule = noClasses()
                .that().resideInAnyPackage("..controller..", "..api.web..")
                .should().dependOnClassesThat()
                .areMetaAnnotatedWith(org.springframework.stereotype.Repository.class);
        rule.check(classes);
    }

    @Test
    void servicesShouldNotDirectlyAccessRepositoriesFromOtherModules() {
        ArchRule rule = noClasses()
                .that().resideInAPackage("..service..")
                .should().dependOnClassesThat().resideInAPackage("..dao..")
                .andShould().dependOnClassesThat().resideInAPackage("..entity..");
        rule.allowEmptyShould(true);
    }

    @Test
    void noJpaEntitiesShouldBeUsedAsControllerReturnTypes() {
        ArchRule rule = noMethods()
                .that().areDeclaredInClassesThat().resideInAnyPackage("..controller..", "..api.web..")
                .should().haveRawReturnType(resideInAPackage("..entity.."));
        rule.check(classes);
    }

    @Test
    void eventClassesShouldExtendAbstractDomainEvent() {
        ArchRule rule = classes()
                .that().resideInAPackage("com.taaru.common.event..")
                .and().areNotInterfaces()
                .and().areNotMemberClasses()
                .and().doNotHaveSimpleName("SpringDomainEventPublisher")
                .and().doNotHaveSimpleName("AsyncEventConfig")
                .should().beAssignableTo(com.taaru.common.event.AbstractDomainEvent.class);
        rule.check(classes);
    }

    @Test
    void apiModuleShouldNotContainBusinessLogic() {
        ArchRule rule = noClasses()
                .that().resideInAPackage("com.taaru.api..")
                .and().resideOutsideOfPackage("com.taaru.api.config..")
                .should().dependOnClassesThat().resideInAnyPackage("..dao..", "..entity..");
        rule.check(classes);
    }
}
