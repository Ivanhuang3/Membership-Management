# Spring1-MemberControl7

此項目是一個基於 Spring Boot 的會員管理系統，實現了 RESTful API 的增刪改查（CRUD）功能。

## 專案結構

```
src/main/java/com/example/demo/
├── MemberControl7Application.java - 主應用程式
├── Brad07.java - 會員 CRUD 控制器
├── model/
│   ├── Member.java - 會員模型
│   └── Response.java - API 回應模型
└── utils/
    └── BCrypt.java - 密碼加密工具
```

## 資料庫設定

本專案使用 MySQL 資料庫，請先確保您已經建立了 `north` 資料庫並創建以下資料表：

```sql
CREATE TABLE IF NOT EXISTS member (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  account VARCHAR(255) NOT NULL UNIQUE,
  passwd VARCHAR(255) NOT NULL,
  realname VARCHAR(255) NOT NULL,
  icon BLOB
);
```

## API 端點

### 1. 新增會員

```
POST /brad07/member
```

請求體 (JSON):
```json
{
  "account": "user1",
  "passwd": "password123",
  "realname": "使用者一"
}
```

### 2. 刪除會員

```
DELETE /brad07/member/{id}
```

### 3. 更新會員

```
PUT /brad07/member/{id}
```

請求體 (JSON):
```json
{
  "account": "user1updated",
  "realname": "更新的使用者"
}
```

### 4. 查詢所有會員

```
GET /brad07/members
```

### 5. 查詢單個會員

```
GET /brad07/member/{id}
```

### 6. 搜索會員

```
GET /brad07/members/search/{keyword}
```

## 運行專案

1. 確保 MySQL 已啟動並建立了 `member` 資料庫及必要資料表
2. 運行以下命令：

```bash
mvn spring-boot:run
```

## 回應格式

所有 API 端點都返回統一的 JSON 格式：

```json
{
  "error": 0,      // 0 表示成功，非 0 表示錯誤
  "mesg": "OK",    // 錯誤或成功訊息
  "insertId": 0,   // 新增操作返回的 ID
  "data": null     // 查詢操作返回的資料
}
``` 