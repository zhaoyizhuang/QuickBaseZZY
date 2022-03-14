import axios from "axios";

const BUILDER_API = "http://www.mocky.io/v2/566061f21200008e3aabd919";

export const createForm = (form, controller) =>
     axios.post(`${BUILDER_API}`, form, {signal: controller.signal})
         .then(response => response.data)
         .catch((err) => {
             if (axios.isCancel(err)) {
                 console.log('cancelled', err.message);
             } else {
                 window.alert(err.message);
             }
         });