package com.example.tetris.controller;

import com.example.tetris.service.ClientIdService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ClientController {

    private final ClientIdService clientIdService;

    @GetMapping("/client-id")
    public int getClientId() {
        return clientIdService.getNextClientId();
    }
}