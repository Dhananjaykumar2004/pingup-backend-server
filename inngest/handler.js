import { serve } from "inngest/express";
import { inngest, functions } from "./index.js";

export default serve(inngest, functions);
