package com.example.tetris.config;

import com.example.tetris.server.WebSocketEndpoint;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration  //웹소켓 구성 설정
@EnableWebSocket   //스프링 설정 정보 제공
public class WebSocketConfig implements WebSocketConfigurer, WebSocketMessageBrokerConfigurer{
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new WebSocketEndpoint(), "/ws").setAllowedOrigins("*");
    }

}
