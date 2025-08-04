import axios from "axios";
import { env } from "../config/env";
import { getAuth } from "./requestContext";
import { jwtDecode } from "jwt-decode";

export const findContactTool = async () => {
  const authHeader = getAuth();
  const jwt = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  const { sub: userId } = jwtDecode(jwt!) as { sub: string };

  try {
    const response = await axios.get(env.GATEWAY_TO_BUILDER_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authHeader}`,
      },
    });

    return {
      found: response.data.data.length > 0,
      contacts: response.data.data,
      message:
        response.data.data.length > 0
          ? `Se encontraron ${response.data.data.length} contactos que coinciden con los criterios.`
          : "No se encontraron contactos que coincidan con los criterios.",
    };
  } catch (error) {
    console.error("Error al buscar contactos:", error);
    return {
      found: false,
      contacts: [],
      message: "Error al buscar contactos. Por favor, inténtalo de nuevo.",
    };
  }
};
