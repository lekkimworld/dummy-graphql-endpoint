
-- Create schema
CREATE SCHEMA IF NOT EXISTS DATACLOUD;

-- Drop tables if they exist
DROP VIEW IF EXISTS DATACLOUD.ORDER_ROUTE_VIEW;
DROP TABLE IF EXISTS DATACLOUD.CARGO;
DROP TABLE IF EXISTS DATACLOUD.ROUTE;
DROP TABLE IF EXISTS DATACLOUD.ORDER;
DROP TABLE IF EXISTS DATACLOUD.CONTACT;
DROP TABLE IF EXISTS DATACLOUD.CUSTOMER;
DROP TYPE IF EXISTS TRANSPORT_TYPE;

CREATE TABLE DATACLOUD.CUSTOMER (
    CUSTOMER_ID VARCHAR(15) PRIMARY KEY,
    CUSTOMER_NAM VARCHAR(255),
    LAST_MODIFIED TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE DATACLOUD.CONTACT (
    CONTACT_ID VARCHAR(15) PRIMARY KEY,
    CUSTOMER_ID VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) NOT NULL,
    FN VARCHAR(255) NOT NULL,
    LN VARCHAR(255) NOT NULL,
    LAST_MODIFIED TIMESTAMP WITH TIME ZONE NOT NULL,
    FOREIGN KEY (CUSTOMER_ID) REFERENCES DATACLOUD.CUSTOMER(CUSTOMER_ID)
);

CREATE TABLE DATACLOUD.ORDER (
    ID VARCHAR(36) PRIMARY KEY,
    CUSTOMER_ID VARCHAR(255),
    START_CIT VARCHAR(255) NOT NULL,
    START_LAT DOUBLE PRECISION NOT NULL,
    START_LONG DOUBLE PRECISION NOT NULL,
    END_CIT VARCHAR(255) NOT NULL,
    END_LAT DOUBLE PRECISION NOT NULL,
    END_LONG DOUBLE PRECISION NOT NULL,
    LAST_MODIFIED TIMESTAMP WITH TIME ZONE NOT NULL,
    FOREIGN KEY (CUSTOMER_ID) REFERENCES DATACLOUD.CUSTOMER(CUSTOMER_ID)
);

CREATE TYPE TRANSPORT_TYPE AS ENUM ('sea', 'air', 'rail');

-- Create route table
CREATE TABLE DATACLOUD.ROUTE (
    ID VARCHAR(15) PRIMARY KEY,
    ORDER_ID VARCHAR(36) NOT NULL,
    TYPE TRANSPORT_TYPE NOT NULL,
    START_CIT VARCHAR(255) NOT NULL,
    START_LAT DOUBLE PRECISION NOT NULL,
    START_LONG DOUBLE PRECISION NOT NULL,
    END_CIT VARCHAR(255) NOT NULL,
    END_LAT DOUBLE PRECISION NOT NULL,
    END_LONG DOUBLE PRECISION NOT NULL,
    HOURS DOUBLE PRECISION,
    SDT TIMESTAMP WITH TIME ZONE,
    EDT TIMESTAMP WITH TIME ZONE,
    LAST_MODIFIED TIMESTAMP WITH TIME ZONE NOT NULL,
    FOREIGN KEY (ORDER_ID) REFERENCES DATACLOUD.ORDER(ID)
);

-- Create cargo table
CREATE TABLE DATACLOUD.CARGO (
    ORDER_ID VARCHAR(36) NOT NULL,
    CARGO_ID VARCHAR(36) NOT NULL PRIMARY KEY,
    CONTAINER_NO VARCHAR(36) NOT NULL,
    CONTENT VARCHAR(36) NOT NULL,
    PERISHABLE INTEGER DEFAULT 0,
    COMMODITY INTEGER DEFAULT 0,
    ELECTRICITY INTEGER DEFAULT 0,
    LAST_MODIFIED TIMESTAMP WITH TIME ZONE NOT NULL,
    FOREIGN KEY (ORDER_ID) REFERENCES DATACLOUD.ORDER(ID)
);


CREATE VIEW DATACLOUD.ORDER_ROUTE_VIEW AS
SELECT
    o.ID AS ORDER_ID,
    o.CUSTOMER_ID AS CUSTOMER_ID,
    r.ID AS ROUTE_ID,
    r.TYPE AS ROUTE_TYPE,
    r.START_CIT AS START_CITY,
    r.START_LAT AS START_LATITUDE,
    r.START_LONG AS START_LONGITUDE,
    r.END_CIT AS END_CITY,
    r.END_LAT AS END_LATITUDE,
    r.END_LONG AS END_LONGITUDE,
    r.HOURS AS ROUTE_HOURS,
    r.SDT AS START_DATETIME,
    r.EDT AS END_DATETIME,
    r.LAST_MODIFIED AS LAST_MODIFIED
FROM
    DATACLOUD.ORDER o
JOIN
    DATACLOUD.ROUTE r ON o.ID = r.ORDER_ID;
    