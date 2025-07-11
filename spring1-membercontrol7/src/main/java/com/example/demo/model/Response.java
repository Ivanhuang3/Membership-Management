package com.example.demo.model;

import org.springframework.stereotype.Component;

@Component
public class Response {
    private int error;
    private String mesg;
    private int insertId;
    private Object data; // 添加 data 字段以統一回應結構

    public int getError() {
        return error;
    }

    public void setError(int error) {
        this.error = error;
    }

    public String getMesg() {
        return mesg;
    }

    public void setMesg(String mesg) {
        this.mesg = mesg;
    }

    public int getInsertId() {
        return insertId;
    }

    public void setInsertId(int insertId) {
        this.insertId = insertId;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
} 