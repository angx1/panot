export const plannerResponseJsonSchema = {
  type: "object",
  properties: {
    actions: {
      type: "array",
      description: "Lista de acciones a realizar basadas en la transcripción",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["create_contact", "update_contact", "delete_contact"],
            description: "Tipo de acción",
          },
          payload: {
            type: "object",
            description: "Datos para la acción",
            properties: {
              // Para create_contact y update_contact
              first_name: {
                type: "string",
                description: "Primer nombre del contacto",
              },
              last_name: {
                type: "string",
                description: "Apellido del contacto",
              },
              company: {
                type: "string",
                description: "Empresa del contacto",
              },
              job_title: {
                type: "string",
                description: "Cargo o puesto del contacto",
              },
              department: {
                type: "string",
                description: "Departamento del contacto",
              },
              address: {
                type: "string",
                description: "Dirección del contacto",
              },
              birthday: {
                type: "string",
                description: "Fecha de nacimiento en formato ISO",
              },
              notes: {
                type: "string",
                description: "Notas adicionales sobre el contacto",
              },
              // Para update_contact y delete_contact
              id: {
                type: "string",
                description: "ID del contacto",
              },
              // Para create_contact y update_contact
              channels: {
                type: "array",
                description: "Canales de comunicación del contacto",
                items: {
                  type: "object",
                  properties: {
                    kind: {
                      type: "string",
                      enum: ["email", "phone", "whatsapp", "telegram", "other"],
                      description: "Tipo de canal",
                    },
                    label: {
                      type: "string",
                      description: "Etiqueta del canal",
                    },
                    value: {
                      type: "string",
                      description:
                        "Valor del canal (ej: dirección de email, número de teléfono)",
                    },
                    _op: {
                      type: "string",
                      enum: ["add", "update", "delete"],
                      description:
                        "Operación a realizar con el canal (solo para update_contact)",
                    },
                  },
                  required: ["kind", "label", "value"],
                },
              },
            },
            required: ["first_name"],
          },
        },
        required: ["type", "payload"],
      },
      minItems: 1,
    },
  },
  required: ["actions"],
};

export const schemaWithMetadata = {
  type: "json_schema",
  schema: plannerResponseJsonSchema,
};
