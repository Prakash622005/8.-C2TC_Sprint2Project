package com.shoppingmall.customer_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shoppingmall.customer_service.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
