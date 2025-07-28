import { z } from 'zod';

declare const UUID: z.ZodUUID;
declare const Timestamp: z.ZodISODateTime;
declare const IdempotencyKey: z.ZodString;
declare const ChannelKind: z.ZodEnum<{
    phone: "phone";
    email: "email";
    url: "url";
    social: "social";
}>;
type ChannelKind = z.infer<typeof ChannelKind>;

declare const ManualEnvelope: z.ZodObject<{
    mode: z.ZodLiteral<"manual">;
    idempotency_key: z.ZodOptional<z.ZodString>;
    actions: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"create_contact">;
        payload: z.ZodObject<{
            first_name: z.ZodString;
            last_name: z.ZodOptional<z.ZodString>;
            company: z.ZodOptional<z.ZodString>;
            job_title: z.ZodOptional<z.ZodString>;
            department: z.ZodOptional<z.ZodString>;
            address: z.ZodOptional<z.ZodString>;
            birthday: z.ZodOptional<z.ZodISODate>;
            notes: z.ZodOptional<z.ZodString>;
            channels: z.ZodOptional<z.ZodArray<z.ZodObject<{
                kind: z.ZodEnum<{
                    phone: "phone";
                    email: "email";
                    url: "url";
                    social: "social";
                }>;
                label: z.ZodOptional<z.ZodString>;
                value: z.ZodString;
            }, z.core.$strip>>>;
            is_self: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"update_contact">;
        payload: z.ZodObject<{
            first_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            company: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            job_title: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            department: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            birthday: z.ZodOptional<z.ZodOptional<z.ZodISODate>>;
            notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            id: z.ZodUUID;
            channels: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodUUID>;
                kind: z.ZodEnum<{
                    phone: "phone";
                    email: "email";
                    url: "url";
                    social: "social";
                }>;
                label: z.ZodOptional<z.ZodString>;
                value: z.ZodString;
                _op: z.ZodDefault<z.ZodEnum<{
                    add: "add";
                    update: "update";
                    delete: "delete";
                }>>;
            }, z.core.$strip>>>;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"delete_contact">;
        payload: z.ZodObject<{
            id: z.ZodUUID;
        }, z.core.$strip>;
    }, z.core.$strip>]>>;
}, z.core.$strip>;
declare const NlpEnvelope: z.ZodObject<{
    mode: z.ZodLiteral<"nlp">;
    idempotency_key: z.ZodOptional<z.ZodString>;
    transcript: z.ZodString;
}, z.core.$strip>;
declare const CommandEnvelope: z.ZodUnion<readonly [z.ZodObject<{
    mode: z.ZodLiteral<"manual">;
    idempotency_key: z.ZodOptional<z.ZodString>;
    actions: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"create_contact">;
        payload: z.ZodObject<{
            first_name: z.ZodString;
            last_name: z.ZodOptional<z.ZodString>;
            company: z.ZodOptional<z.ZodString>;
            job_title: z.ZodOptional<z.ZodString>;
            department: z.ZodOptional<z.ZodString>;
            address: z.ZodOptional<z.ZodString>;
            birthday: z.ZodOptional<z.ZodISODate>;
            notes: z.ZodOptional<z.ZodString>;
            channels: z.ZodOptional<z.ZodArray<z.ZodObject<{
                kind: z.ZodEnum<{
                    phone: "phone";
                    email: "email";
                    url: "url";
                    social: "social";
                }>;
                label: z.ZodOptional<z.ZodString>;
                value: z.ZodString;
            }, z.core.$strip>>>;
            is_self: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"update_contact">;
        payload: z.ZodObject<{
            first_name: z.ZodOptional<z.ZodString>;
            last_name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            company: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            job_title: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            department: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            birthday: z.ZodOptional<z.ZodOptional<z.ZodISODate>>;
            notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
            id: z.ZodUUID;
            channels: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodOptional<z.ZodUUID>;
                kind: z.ZodEnum<{
                    phone: "phone";
                    email: "email";
                    url: "url";
                    social: "social";
                }>;
                label: z.ZodOptional<z.ZodString>;
                value: z.ZodString;
                _op: z.ZodDefault<z.ZodEnum<{
                    add: "add";
                    update: "update";
                    delete: "delete";
                }>>;
            }, z.core.$strip>>>;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"delete_contact">;
        payload: z.ZodObject<{
            id: z.ZodUUID;
        }, z.core.$strip>;
    }, z.core.$strip>]>>;
}, z.core.$strip>, z.ZodObject<{
    mode: z.ZodLiteral<"nlp">;
    idempotency_key: z.ZodOptional<z.ZodString>;
    transcript: z.ZodString;
}, z.core.$strip>]>;
type CommandEnvelope = z.infer<typeof CommandEnvelope>;

declare const ErrorShape: z.ZodObject<{
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodAny>;
    }, z.core.$strip>;
}, z.core.$strip>;
type ErrorShape = z.infer<typeof ErrorShape>;

declare const Channel: z.ZodObject<{
    id: z.ZodOptional<z.ZodUUID>;
    kind: z.ZodEnum<{
        phone: "phone";
        email: "email";
        url: "url";
        social: "social";
    }>;
    label: z.ZodOptional<z.ZodString>;
    value: z.ZodString;
}, z.core.$strip>;
declare const ContactCard: z.ZodObject<{
    first_name: z.ZodString;
    last_name: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    job_title: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    birthday: z.ZodOptional<z.ZodISODate>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const ContactCreate: z.ZodObject<{
    first_name: z.ZodString;
    last_name: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    job_title: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    birthday: z.ZodOptional<z.ZodISODate>;
    notes: z.ZodOptional<z.ZodString>;
    channels: z.ZodOptional<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<{
            phone: "phone";
            email: "email";
            url: "url";
            social: "social";
        }>;
        label: z.ZodOptional<z.ZodString>;
        value: z.ZodString;
    }, z.core.$strip>>>;
    is_self: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
declare const ContactUpdate: z.ZodObject<{
    first_name: z.ZodOptional<z.ZodString>;
    last_name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    company: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    job_title: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    department: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    birthday: z.ZodOptional<z.ZodOptional<z.ZodISODate>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    id: z.ZodUUID;
    channels: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodUUID>;
        kind: z.ZodEnum<{
            phone: "phone";
            email: "email";
            url: "url";
            social: "social";
        }>;
        label: z.ZodOptional<z.ZodString>;
        value: z.ZodString;
        _op: z.ZodDefault<z.ZodEnum<{
            add: "add";
            update: "update";
            delete: "delete";
        }>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
declare const Contact: z.ZodObject<{
    first_name: z.ZodString;
    last_name: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    job_title: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    birthday: z.ZodOptional<z.ZodISODate>;
    notes: z.ZodOptional<z.ZodString>;
    id: z.ZodUUID;
    owner_id: z.ZodUUID;
    is_self: z.ZodBoolean;
    created_at: z.ZodISODateTime;
}, z.core.$strip>;
type Contact = z.infer<typeof Contact>;

declare const CreateContactAction: z.ZodObject<{
    type: z.ZodLiteral<"create_contact">;
    payload: z.ZodObject<{
        first_name: z.ZodString;
        last_name: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodString>;
        job_title: z.ZodOptional<z.ZodString>;
        department: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        birthday: z.ZodOptional<z.ZodISODate>;
        notes: z.ZodOptional<z.ZodString>;
        channels: z.ZodOptional<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<{
                phone: "phone";
                email: "email";
                url: "url";
                social: "social";
            }>;
            label: z.ZodOptional<z.ZodString>;
            value: z.ZodString;
        }, z.core.$strip>>>;
        is_self: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const UpdateContactAction: z.ZodObject<{
    type: z.ZodLiteral<"update_contact">;
    payload: z.ZodObject<{
        first_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        company: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        job_title: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        department: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        birthday: z.ZodOptional<z.ZodOptional<z.ZodISODate>>;
        notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        id: z.ZodUUID;
        channels: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodUUID>;
            kind: z.ZodEnum<{
                phone: "phone";
                email: "email";
                url: "url";
                social: "social";
            }>;
            label: z.ZodOptional<z.ZodString>;
            value: z.ZodString;
            _op: z.ZodDefault<z.ZodEnum<{
                add: "add";
                update: "update";
                delete: "delete";
            }>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const DeleteContactAction: z.ZodObject<{
    type: z.ZodLiteral<"delete_contact">;
    payload: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const Action: z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"create_contact">;
    payload: z.ZodObject<{
        first_name: z.ZodString;
        last_name: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodString>;
        job_title: z.ZodOptional<z.ZodString>;
        department: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        birthday: z.ZodOptional<z.ZodISODate>;
        notes: z.ZodOptional<z.ZodString>;
        channels: z.ZodOptional<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<{
                phone: "phone";
                email: "email";
                url: "url";
                social: "social";
            }>;
            label: z.ZodOptional<z.ZodString>;
            value: z.ZodString;
        }, z.core.$strip>>>;
        is_self: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"update_contact">;
    payload: z.ZodObject<{
        first_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        company: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        job_title: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        department: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        birthday: z.ZodOptional<z.ZodOptional<z.ZodISODate>>;
        notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        id: z.ZodUUID;
        channels: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodUUID>;
            kind: z.ZodEnum<{
                phone: "phone";
                email: "email";
                url: "url";
                social: "social";
            }>;
            label: z.ZodOptional<z.ZodString>;
            value: z.ZodString;
            _op: z.ZodDefault<z.ZodEnum<{
                add: "add";
                update: "update";
                delete: "delete";
            }>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"delete_contact">;
    payload: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>]>;
type Action = z.infer<typeof Action>;
declare const ActionList: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"create_contact">;
    payload: z.ZodObject<{
        first_name: z.ZodString;
        last_name: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodString>;
        job_title: z.ZodOptional<z.ZodString>;
        department: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        birthday: z.ZodOptional<z.ZodISODate>;
        notes: z.ZodOptional<z.ZodString>;
        channels: z.ZodOptional<z.ZodArray<z.ZodObject<{
            kind: z.ZodEnum<{
                phone: "phone";
                email: "email";
                url: "url";
                social: "social";
            }>;
            label: z.ZodOptional<z.ZodString>;
            value: z.ZodString;
        }, z.core.$strip>>>;
        is_self: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"update_contact">;
    payload: z.ZodObject<{
        first_name: z.ZodOptional<z.ZodString>;
        last_name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        company: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        job_title: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        department: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        birthday: z.ZodOptional<z.ZodOptional<z.ZodISODate>>;
        notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        id: z.ZodUUID;
        channels: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodUUID>;
            kind: z.ZodEnum<{
                phone: "phone";
                email: "email";
                url: "url";
                social: "social";
            }>;
            label: z.ZodOptional<z.ZodString>;
            value: z.ZodString;
            _op: z.ZodDefault<z.ZodEnum<{
                add: "add";
                update: "update";
                delete: "delete";
            }>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"delete_contact">;
    payload: z.ZodObject<{
        id: z.ZodUUID;
    }, z.core.$strip>;
}, z.core.$strip>]>>;

export { Action, ActionList, Channel, ChannelKind, CommandEnvelope, Contact, ContactCard, ContactCreate, ContactUpdate, CreateContactAction, DeleteContactAction, ErrorShape, IdempotencyKey, ManualEnvelope, NlpEnvelope, Timestamp, UUID, UpdateContactAction };
