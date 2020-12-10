package com.shopnow.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/product_types")
public class ProductTypeController {

    @GetMapping
    public String index(){
        return "admin/layout";
    }
}