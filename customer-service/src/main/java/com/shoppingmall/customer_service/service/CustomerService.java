package com.shoppingmall.customer_service.service;

import java.util.List;
import com.shoppingmall.customer_service.entity.Customer;

public interface CustomerService {

    Customer addCustomer(Customer customer);

    Customer getCustomerById(Long id);

    List<Customer> getAllCustomers();

    Customer updateCustomer(Long id, Customer customer);

    void deleteCustomer(Long id);
}
