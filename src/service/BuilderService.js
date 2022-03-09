import axios from "axios";

const BUILDER_API = "http://www.mocky.io/v2/566061f21200008e3aabd919";

export const createForm = (form) =>
     axios.post(`${BUILDER_API}`, form)
         .then(response => response.data);