// What the course and the software it teaches are called (course/course.yaml `brand`, `product.name`),
// for the sim prompts and the rubric's {{product}}.
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { COURSE_ROOT } from "../server/config.ts";

const cy = YAML.parse(fs.readFileSync(path.join(COURSE_ROOT, "course", "course.yaml"), "utf8"));
export const product: string = String(cy.product?.name ?? "the software");
export const brand: string = String(cy.brand ?? cy.title);
