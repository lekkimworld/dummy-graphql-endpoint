import "reflect-metadata";
import { config as config_dotenv } from "dotenv";
config_dotenv();
import {
    getAllAccounts,
    getAllContacts,
    getAllShipments,
    getAllRoutes,
    getAllCargo,
    cargo,
    accounts
} from "./data";
import { appendFileSync, rmSync } from "fs";
import { Account, Cargo, Contact, Route, Shipment } from "./types";
import { join } from "path";
import { generateIncrementingId } from "./utils";

const CSV_SEPARATOR = ",";
const DB_SCHEMA = "DATACLOUD";
const LAST_MODIFIED = "LAST_MODIFIED";
const addLastModified = true;
const BASE_PATH = "generated";
const BOOLEAN_AS_STRING = true;
const BOOLEAN_STRING_TRUE = "Yes";
const BOOLEAN_STRING_FALSE = "No";

const filenameAccountsSalesforceCSV = join(BASE_PATH, "accounts-salesforce.csv");
const filenameContactsSalesforceCSV = join(BASE_PATH, "contacts-salesforce.csv");
const filenameAccountsDDL = join(BASE_PATH, "accounts.sql");
const filenameContactsDdl = join(BASE_PATH, "contacts.sql");
const filenameShipmentsDdl = join(BASE_PATH, "shipments.sql");
const filenameRoutesDdl = join(BASE_PATH, "routes.sql");
const filenameCargoDdl = join(BASE_PATH, "cargo.sql");
const filenameCommitmentsCSV = join(BASE_PATH, "commitments.csv");

type OutputType = "csv" | "ddl";
type RecordsFilterPredicate<T> = (type: OutputType, a: T) => boolean;

const filterRecords = <T>(records: Array<T>, type: OutputType, predicate?: RecordsFilterPredicate<T>): Array<T> => {
    if (!predicate) return records;
    return records.filter((r) => predicate(type, r));
};

const getNestedValueByPath = (obj: any, key: string): string => {
    const keys = key.split(".");
    const v = keys.reduce((prev, key) => {
        return prev[key];
    }, obj);
    if (BOOLEAN_AS_STRING && typeof v === "boolean") {
        return v ? BOOLEAN_STRING_TRUE : BOOLEAN_STRING_FALSE;
    } else {
        return v;
    }
};

const writeCsvFile = async (filename: string, fieldNames: any, objs: Array<any>, args?: any): Promise<void> => {
    deleteFile(filename);
    writeCsvHeader(filename, fieldNames, args);
    objs.forEach((obj: any) => writeCsvRow(filename, fieldNames, obj, args));
    return Promise.resolve();
};

const writeCsvHeader = async (filename: string, fieldNames: any, args?: any) => {
    let lastmod = "";
    if (!args) {
        lastmod = addLastModified ? `${LAST_MODIFIED}${CSV_SEPARATOR}` : "";
    }
    appendFileSync(
        filename,
        `${lastmod}${Object.keys(fieldNames).reduce((prev: string, fieldName: string) => {
            const v = (fieldNames as any)[fieldName].toUpperCase();
            const line = !prev.length ? v : `${prev}${CSV_SEPARATOR}${v}`;
            return line;
        }, "")}\n`
    );
};

const writeCsvRow = async (filename: string, fieldNames: any, obj: any, args?: any) => {
    let lastmod = "";
    if (!args) {
        lastmod = addLastModified ? `${new Date().toISOString()}${CSV_SEPARATOR}` : "";
    }
    appendFileSync(
        filename,
        `${lastmod}${Object.keys(fieldNames).reduce((prev: string, fieldName: string) => {
            const value = getNestedValueByPath(obj, fieldName);
            const line = !prev ? value : `${prev}${CSV_SEPARATOR}${value}`;
            return line;
        }, "")}\n`
    );
};

const writeSqlFile = async (
    filename: string,
    tableName: string,
    fieldNames: { [key: string]: string | { name: string; string: boolean } },
    objs: Array<any>
): Promise<void> => {
    deleteFile(filename);
    writeSqlStart(filename, tableName, fieldNames);
    appendFileSync(
        filename,
        `${objs
            .map((obj: any) => generateSqlRow(fieldNames, obj))
            .map((v) => `(${v})`)
            .join(",\n")}`
    );
    writeSqlEnd(filename);
    return Promise.resolve();
};

const writeSqlStart = async (
    filename: string,
    tableName: string,
    inputFieldNames: { [key: string]: string | { name: string; string: boolean } }
) => {
    let fieldNames = inputFieldNames;
    if (addLastModified) fieldNames[LAST_MODIFIED] = LAST_MODIFIED;
    appendFileSync(
        filename,
        `INSERT INTO ${DB_SCHEMA}.${tableName.toUpperCase()} (${Object.keys(fieldNames)
            .map((fieldName) => {
                return typeof fieldNames[fieldName] === "object"
                    ? fieldNames[fieldName].name.toUpperCase()
                    : fieldNames[fieldName].toUpperCase();
            })
            .join(", ")}) VALUES \n`
    );
};

const generateSqlRow = (fieldNames: any, obj: any) => {
    const result = `${Object.keys(fieldNames).reduce((prev: string, fieldName: string) => {
        const rawValue =
            addLastModified && fieldName === LAST_MODIFIED
                ? new Date().toISOString()
                : getNestedValueByPath(obj, fieldName);
        let value = (typeof fieldNames[fieldName] === "object" ? fieldNames[fieldName].string : true)
            ? `'${rawValue}'`
            : rawValue;
        if (typeof value === "boolean") value = value ? "1" : "0";
        const line = !prev ? value : `${prev}, ${value}`;
        return line;
    }, "")}`;
    return result;
};

const writeSqlEnd = async (filename: string) => {
    appendFileSync(filename, `;\n`);
};
type CsvData<T> = {
    csv: Array<T>;
    filename: string;
};
type OutputData<T> = {
    csv1?: CsvData<T>;
    csv2?: CsvData<T>;
    sql?: Array<T>;
};
const writeAccounts = async (args?: OutputData<Account>): Promise<void> => {
    [args?.csv1, args?.csv2]
        .filter((c) => undefined !== c)
        .forEach((c) => {
            writeCsvFile(
                c.filename,
                {
                    accountId: "account_id",
                    name: "account_name",
                },
                c.csv
            );
        });

    if (args?.sql) {
        writeSqlFile(
            filenameAccountsDDL,
            "CUSTOMER",
            {
                accountId: { name: "CUSTOMER_ID", string: true },
                name: { name: "CUSTOMER_NAM", string: true },
            },
            args?.sql || getAllAccounts()
        );
    }
};

const writeContacts = async (args?: OutputData<Contact>): Promise<void> => {
    [args?.csv1, args?.csv2]
        .filter((c) => undefined !== c)
        .forEach((c) => {
            writeCsvFile(
                c.filename,
                {
                    accountId: "account_id",
                    contactId: "contact_id",
                    email: "email",
                    firstName: "firstname",
                    lastName: "lastname",
                },
                c.csv
            );
        });

    if (args?.sql) {
        writeSqlFile(
            filenameContactsDdl,
            "CONTACT",
            {
                accountId: "CUSTOMER_ID",
                contactId: "contact_id",
                email: "email",
                firstName: "fn",
                lastName: "ln",
            },
            args?.sql || getAllContacts()
        );
    }
};

const writeShipments = async (args?: OutputData<Shipment>): Promise<void> => {
    [args?.csv1, args?.csv2]
        .filter((c) => undefined !== c)
        .forEach((c) => {
            writeCsvFile(
                c.filename,
                {
                    shipmentId: "shipment_id",
                    accountId: "account_id",
                    "account.name": "account_name",
                    "start.cityName": "place_receipt",
                    "end.cityName": "place_delivery",
                    allowPartial: "partialAllowed",
                    dangerousCargo: "dangerCargo",
                    commodity: "commodity",
                    activeReefer: "activeReefer",
                    businessUnit: "bu",
                    "contact.fullname": "contact_name",
                    "contact.phone": "contact_number",
                    "contact.email": "contact_email",
                    serviceMode: "service_mode"
                },
                c.csv
            );
        });
    
    if (args?.sql) {
        writeSqlFile(
            filenameShipmentsDdl,
            "ORDER",
            {
                shipmentId: "id",
                accountId: "customer_id"
            },
            args?.sql || getAllShipments()
        );
    }
};

const writeRoutes = async (args?: OutputData<Route>): Promise<void> => {
    [args?.csv1, args?.csv2]
        .filter((c) => undefined !== c)
        .forEach((c) => {
            writeCsvFile(
                c.filename,
                {
                    shipmentId: "shipment_id",
                    routeId: "route_id",
                    type: "type",
                    "start.cityName": "start_city",
                    "start.coordinates.latitude": "start_lat",
                    "start.coordinates.longitude": "start_lon",
                    "end.cityName": "end_city",
                    "end.coordinates.latitude": "end_lat",
                    "end.coordinates.longitude": "end_lon",
                    hours: "hours",
                    startdt: "start_dt",
                    enddt: "end_dt",
                    service: "service",
                },
                c.csv
            );
        });

        if (args?.sql) {
            writeSqlFile(
                filenameRoutesDdl,
                "ROUTE",
                {
                    shipmentId: "order_id",
                    routeId: "id",
                    type: "type",
                    "start.cityName": "start_cit",
                    "start.coordinates.latitude": { name: "start_lat", string: false },
                    "start.coordinates.longitude": { name: "start_lonG", string: false },
                    "end.cityName": "end_cit",
                    "end.coordinates.latitude": { name: "end_lat", string: false },
                    "end.coordinates.longitude": { name: "end_long", string: false },
                    hours: { name: "hours", string: false },
                    startdt: "sdt",
                    enddt: "edt",
                },
                args?.sql || getAllRoutes()
            );
        }
};

const writeCargo = async (args?: OutputData<Cargo>): Promise<void> => {
    [args?.csv1, args?.csv2]
        .filter((c) => undefined !== c)
        .forEach((c) => {
            writeCsvFile(
                c.filename,
                {
                    equipmentId: "equipment_id",
                    shipmentId: "shipment_id",
                    containerNo: "container_no",
                    contents: "contents",
                    isPerishable: "is_perisable",
                    isCommodity: "is_commodity",
                    needsElectricity: "needs_power",
                },
                c.csv
            );
        });

    if (args?.sql) {
        writeSqlFile(
            filenameCargoDdl,
            "CARGO",
            {
                equipmentId: "cargo_id",
                shipmentId: "order_id",
                containerNo: "container_no",
                contents: "content",
                isPerishable: { name: "PERISHABLE", string: false },
                isCommodity: { name: "commodity", string: false },
                needsElectricity: { name: "electricity", string: false },
            },
            args?.sql || getAllCargo()
        );
    }
};

const deleteFile = (filename: string) => {
    try {
        rmSync(filename);
    } catch (e) {}
};

type ShipmentWithAccount = { account: { name: string } } & Shipment;

const execute = async () => {
    const routes = getAllRoutes();
    const shipments : ShipmentWithAccount[] = getAllShipments().map(s => {
        return Object.assign({ account: { name: accounts.get(s.accountId)!.name } }, s);
    });
    
    await writeAccounts();
    await writeContacts();
    await writeShipments({
        csv1: {
            csv: shipments,
            filename: join(BASE_PATH, "shipments.csv"),
        }
    });
    
    await writeRoutes({
        csv1: {
            csv: routes,
            filename: join(BASE_PATH, "routes.csv"),
        }
    });

    await writeCargo({
        csv1: {
            csv: shipments.reduce((prev, s) => {
                prev.push(...cargo.get(s.shipmentId)!);
                return prev;
            }, new Array<Cargo>()),
            filename: join(BASE_PATH, "cargo.csv"),
        }
    });
    
    // write for salesforce
    writeCsvFile(
        filenameAccountsSalesforceCSV,
        {
            accountId: "External_ID__c",
            name: "Name",
        },
        getAllAccounts(),
        { noLastMod: true }
    );
    writeCsvFile(
        filenameContactsSalesforceCSV,
        {
            accountId: "Account.External_ID__c",
            contactId: "External_ID__c",
            email: "Email",
            firstName: "Firstname",
            lastName: "Lastname",
        },
        getAllContacts(),
        { noLastMod: true }
    );

    // make up commitment data
    writeCsvFile(
        filenameCommitmentsCSV,
        {
            id: "Commit_ID",
            accountId: "Account_ID",
            behind: "BehindCommit",
            percentage: "Deviation"
        },
        Array.from(accounts.values()).map((a, idx) => {
            return {
                id: generateIncrementingId("COMMIT", idx),
                accountId: a.accountId,
                behind: Math.random() < 0.5,
                percentage: Math.round(Math.random() * 100) / 100
            }
        })
    );
};
execute();
