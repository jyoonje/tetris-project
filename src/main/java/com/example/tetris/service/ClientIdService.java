package com.example.tetris.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ClientIdService {
    private final AtomicInteger currentId = new AtomicInteger(0);

    public int getNextClientId() {
        return currentId.incrementAndGet();
    }
}
