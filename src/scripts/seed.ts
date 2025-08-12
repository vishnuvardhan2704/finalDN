

import * as admin from 'firebase-admin';
import type { Product } from '../lib/types';

// IMPORTANT: Before running this script, you must have your service account key
// as `serviceAccountKey.json` in the root of your project.
// Make sure this file is included in your .gitignore.
let serviceAccount;
try {
  serviceAccount = require('../../serviceAccountKey.json');
} catch (e) {
  console.error("Error: `serviceAccountKey.json` not found in the root directory.");
  console.error("Please download it from your Firebase project settings and place it in the project root.");
  process.exit(1);
}

// Step 1: Paste your JSON data here
// ===================================
// Replace the empty array `[]` with the JSON array you have.
// The script expects fields: "name", "description", "Carbon intensity", and "industry".
const rawData: any[] = [
  {
      "name":"Frosted Flakes(R) Cereal",
      "description":"Frosted Flakes(R), 23 oz., Produced in Lancaster, PA (One Carton)",
      "Carbon intensity":2.67,
      "industry":"Food Products"
  },
  {
      "name":"Frosted Flakes, 23 oz, produced in Lancaster, PA (one carton)",
      "description":"Cereal",
      "Carbon intensity":2.67,
      "industry":"Food & Beverage"
  },
  {
      "name":"Office Chair",
      "description":"Field not included in 2013 data",
      "Carbon intensity":3.51,
      "industry":"Building Products"
  },
  {
      "name":"Multifunction Printers",
      "description":"bizhub C458",
      "Carbon intensity":13.53,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Multifunction Printers",
      "description":"bizhub C558",
      "Carbon intensity":16.53,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Multifunction Printers",
      "description":"bizhub C658",
      "Carbon intensity":20.67,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"KURALON  fiber",
      "description":"Raw material for tire reinforcing materials",
      "Carbon intensity":6.67,
      "industry":"Chemicals"
  },
  {
      "name":"Portland Cement",
      "description":"Field not included in 2013 data",
      "Carbon intensity":1.1,
      "industry":"Construction Materials"
  },
  {
      "name":"Regular Straight 505\u00c2\u00ae Jeans \u00c2\u0096 Steel (Water<Less\u00c2\u0099)",
      "description":"BLANK",
      "Carbon intensity":19.57,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Regular Straight 505\u00c2\u00ae Jeans \u00c2\u0096 Steel (Water<Less\u00c2\u0099)",
      "description":"BLANK",
      "Carbon intensity":19.57,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Regular Straight 505\u00c2\u00ae Jeans \u00c2\u0096 Steel (Water<Less\u00c2\u0099)",
      "description":null,
      "Carbon intensity":19.57,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"501\u00c2\u00ae Original Jeans \u00c2\u0096 Rinse Run",
      "description":"BLANK",
      "Carbon intensity":15.05,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"501\u00c2\u00ae Original Jeans \u00c2\u0096 Rinse Run",
      "description":"BLANK",
      "Carbon intensity":16.05,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"501\u00c2\u00ae Original Jeans \u00c2\u0096 Dark Stonewash",
      "description":"BLANK",
      "Carbon intensity":16.05,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"501\u00c2\u00ae Original Jeans \u00c2\u0096 Dark Stonewash",
      "description":"BLANK",
      "Carbon intensity":16.05,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"501\u00c2\u00ae Original Jeans \u00c2\u0096 Dark Stonewash",
      "description":null,
      "Carbon intensity":16.05,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Slim Straight 514\u00c2\u0099 Jeans \u00c2\u0096 Indigo Wash",
      "description":"BLANK",
      "Carbon intensity":12.65,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Slim Straight 514\u00c2\u0099 Jeans \u00c2\u0096 Indigo Wash",
      "description":"BLANK",
      "Carbon intensity":12.65,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Slim Straight 514\u00c2\u0099 Jeans \u00c2\u0096 Indigo Wash",
      "description":null,
      "Carbon intensity":9.77,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Slim Straight 514\u00c2\u0099 Jeans \u00c2\u0096 Rigid Tank",
      "description":"BLANK",
      "Carbon intensity":11.32,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Slim Straight 514\u00c2\u0099 Jeans \u00c2\u0096 Rigid Tank",
      "description":"BLANK",
      "Carbon intensity":11.32,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Slim Straight 514\u00c2\u0099 Jeans \u00c2\u0096 Rigid Tank",
      "description":null,
      "Carbon intensity":8.75,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"501\u00c2\u00ae Original Jeans \u00c2\u0096 Light Stonewash",
      "description":"BLANK",
      "Carbon intensity":15.05,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"501\u00c2\u00ae Original Jeans \u00c2\u0096 Light Stonewash",
      "description":"BLANK",
      "Carbon intensity":15.05,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"501\u00c2\u00ae Original Jeans \u00c2\u0096 Medium Stonewash",
      "description":"BLANK",
      "Carbon intensity":16.05,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"501\u00c2\u00ae Original Jeans \u00c2\u0096 Medium Stonewash",
      "description":"BLANK",
      "Carbon intensity":16.05,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Slim Straight 514\u00c2\u0099 Jeans \u00c2\u0096 Tumbled Rigid",
      "description":"BLANK",
      "Carbon intensity":23.53,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Slim Straight 514\u00c2\u0099 Jeans \u00c2\u0096 Tumbled Rigid",
      "description":"BLANK",
      "Carbon intensity":23.53,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Regular Straight 505\u00c2\u00ae Jeans \u00c2\u0096 Range (Water<Less\u00c2\u0099)",
      "description":"BLANK",
      "Carbon intensity":20.87,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Regular Straight 505\u00c2\u00ae Jeans \u00c2\u0096 Range (Water<Less\u00c2\u0099)",
      "description":"BLANK",
      "Carbon intensity":20.87,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Regular Straight 505\u00c2\u00ae Jeans \u00c2\u0096 Range",
      "description":"BLANK",
      "Carbon intensity":20.87,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Regular Straight 505\u00c2\u00ae Jeans \u00c2\u0096 Range",
      "description":"BLANK",
      "Carbon intensity":20.87,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Regular Straight 505\u00c2\u00ae Jeans \u00c2\u0096 House Cat",
      "description":"BLANK",
      "Carbon intensity":19.57,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Regular Straight 505\u00c2\u00ae Jeans \u00c2\u0096 House Cat",
      "description":"BLANK",
      "Carbon intensity":20.87,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"MS315DN - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":100.79,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MS410DN - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":95.81,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"CX310DN - Color Laser Printer",
      "description":"Color Laser Printer",
      "Carbon intensity":75.19,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MS415DN - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":95.08,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MS510DN - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":97.04,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MS610DE - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":107.68,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MS610DN - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":111.38,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MS810DE - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":76.65,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MS810DN - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":73.08,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MS811DN - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":87.0,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MS812DE - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":98.86,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MS812DN - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":100.12,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MX310DN - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":50.79,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"CX410DE - Color Laser Printer",
      "description":"Color Laser Printer",
      "Carbon intensity":103.18,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MX410DE - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":65.1,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MX511DE - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":66.1,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MX611DE - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":76.07,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MX710DE - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":51.15,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MX711DE - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":54.72,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MX810DFE - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":21.48,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MX811DFE - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":25.18,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MX812DFE - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":28.25,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"CX510DE - Color Laser Printer",
      "description":"Color Laser Printer",
      "Carbon intensity":95.8,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"CS310DN - Color Laser Printer",
      "description":"Color Laser Printer",
      "Carbon intensity":96.88,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"CS410DN - Color Laser Printer",
      "description":"Color Laser Printer",
      "Carbon intensity":153.32,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"CS510DE - Color Laser Printer",
      "description":"Color Laser Printer",
      "Carbon intensity":144.64,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"M5163 - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":109.58,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MS310DN - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":95.18,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"MS312DN - Mono Laser Printer",
      "description":"Mono Laser Printer",
      "Carbon intensity":94.28,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Mobile Batteries",
      "description":"With its high productivity and technological superiority, LG Chem accounts for 20% of the global market share. Mobile batteries are widely used in portable media devices such as laptops, cell phones, and tablets. To align our productivity with the rapid growth of smartphones, ultra-book laptops, and tablets, we are assembling more production lines for lithium-ion polymer batteries. Also, we are providing differentiated solutions, including stepped batteries, based on our unique stack & folding technology. Moreover, our growth is accelerating in the non-IT sectors, such as power tools and e-bikes.",
      "Carbon intensity":5.85,
      "industry":"Chemicals"
  },
  {
      "name":"Mobile Batteries",
      "description":"LG Chem's Mobile Batteries is leading the global lithium-ion battery market with excellent technology and productivity.",
      "Carbon intensity":10.25,
      "industry":"Chemicals"
  },
  {
      "name":"LG Chem\u00c2\u0092s automotive batteries are sustaining the undisputed No.1 position in the world based on more than 10 years of R&D capability. LG Chem is equipped with solutions for all types of electrical cars (Hybrid EV, Plugged-in EV, Battery EV) based on strong product development capability and manufacturing competitiveness via mass production experience. This enables LG Chem to supply battery cell, pack and BMS (Battery Management System) to global carmakers such as GM, Ford, Renault, Hyundai-Kia and Volvo. LG Chem expects the increased revenue from its automotive battery business by being awarded next-generation projects from existing customers while strengthening strategic partnerships, and securing new customers. Additionally, LG Chem plans to launch new products to meet customer needs in new applications such as SLI and garden tools.",
      "description":"LG Chem\u00c2\u0092s automotive batteries are sustaining the undisputed No.1 position in the world based on more than 10 years of R&D capability. LG Chem is equipped with solutions for all types of electrical cars (Hybrid EV, Plugged-in EV, Battery EV) based on strong product development capability and manufacturing competitiveness via mass production experience. This enables LG Chem to supply battery cell, pack and BMS (Battery Management System) to global carmakers such as GM, Ford, Renault, Hyundai-Kia and Volvo. LG Chem expects the increased revenue from its automotive battery business by being awarded next-generation projects from existing customers while strengthening strategic partnerships, and securing new customers. Additionally, LG Chem plans to launch new products to meet customer needs in new applications such as SLI and garden tools.",
      "Carbon intensity":3.2,
      "industry":"Chemicals"
  },
  {
      "name":"Automotive Batteries",
      "description":"LG Chem has maintained the undisputed No.1 position in the global automotive battery market with more than 10 years of R&D capability. We are equipped with solutions for all types of electrical cars (Hybrid EV, Plugged-in EV, and Battery EV) based on our strong product development capability and manufacturing competitiveness. This allows LG Chem to supply battery cells, packs, and BMS (Battery Management System) to global carmakers such as GM, Ford, Renault, Hyundai-Kia, and Volvo. LG Chem expects increased revenue from its automotive battery business with its excellent technology capability and partnership with customers by taking more orders from the existing customers while securing new customers. Meanwhile, we plan to launch new products to meet customer needs in new applications such as Micro-HEV.",
      "Carbon intensity":3.11,
      "industry":"Chemicals"
  },
  {
      "name":"Automotive Batteries",
      "description":"Using its excellent technology and quality competency, LG Chem supplies safe batteries for electric vehicles to top carmakers in Korea, U.S., Europe and China. The batteries, applied to green and highly efficient vehicles like electric and hybrid vehicles, are adding environmental values.",
      "Carbon intensity":6.31,
      "industry":"Chemicals"
  },
  {
      "name":"Automotive Battery",
      "description":"Using its excellent technology and quality competency, LG Chem supplies safe batteries for electric vehicles to top carmakers in Korea, U.S., Europe and China. The batteries, applied to green and highly efficient vehicles like electric and hybrid vehicles, are adding environmental values.",
      "Carbon intensity":4.29,
      "industry":"Chemicals"
  },
  {
      "name":"ABS (Acrylonitrile Butadiene Styrene)",
      "description":"LG Chem is leading domestic and international ABS markets by producing and supplying a variety of high-functional ABS products that are widely used in such applications as electrics\/electronics, auto parts, industrial materials, and household items.",
      "Carbon intensity":0.88,
      "industry":"Chemicals"
  },
  {
      "name":"ABS(Acrylonitrile Butadiene Styrene)",
      "description":"LG Chem is leading domestic and international ABS markets by producing and supplying a variety of high-functional ABS products that are widely used in such applications as electrics\/electronics, auto parts, industrial materials, and household items.",
      "Carbon intensity":0.4,
      "industry":"Chemicals"
  },
  {
      "name":"BPA(Bisphenol-A)",
      "description":"LG Chem is leading domestic and international BPA markets by producing and supplying high-quality BPA.",
      "Carbon intensity":1.09,
      "industry":"Chemicals"
  },
  {
      "name":"IT&New Application Battery",
      "description":"LG Chem's IT Batteries is leading the global lithium-ion battery market with excellent technology and productivity.",
      "Carbon intensity":10.61,
      "industry":"Chemicals"
  },
  {
      "name":"LG-E970",
      "description":"Field not included in 2013 data",
      "Carbon intensity":47.59,
      "industry":"Household Durables"
  },
  {
      "name":"Mouse, M185",
      "description":"Cordless Mouse, with battery in Clamshell packaging.",
      "Carbon intensity":31.76,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"White crystalline sugar",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.65,
      "industry":"Food Products"
  },
  {
      "name":"Sugar",
      "description":"white crystalline sugar",
      "Carbon intensity":0.65,
      "industry":"Food Products"
  },
  {
      "name":"Sugar",
      "description":"White crystalline solid",
      "Carbon intensity":0.65,
      "industry":"Beverages"
  },
  {
      "name":"grinding media cast.",
      "description":"Field not included in 2013 data",
      "Carbon intensity":1.17,
      "industry":"Metals & Mining"
  },
  {
      "name":"IC chips of Smartphone",
      "description":"The smartphone has already become an indispensable part of our daily life. We cannot be without our smartphones for all sorts of activities\u00c2\u0097whether communicating with our friends and family or enjoying music, photography, or filming videos, or even exploring the vast information available online. Hence, we have developed this innovative product due to users' needs for longer battery life and integrated user experience, due to their high dependence on smartphones. Helio is the flagship brand of the MediaTek smartphone processor series; it offers top-notch processing capability, lasting battery life, and outstanding multimedia experience. Helio includes two major series: the Helio X Series is for top performance, and the Helio P Series for technology meets the latest trends. The Helio X Series is equipped with powerful, outstanding calculation capability and uncompromising multimedia features, whereas the Helio P Series offers optimized energy consumption management and streamlined printed circuit board (PCB) size while maintaining outstanding specifications to realize lightweight and fashionable cell phone designs.",
      "Carbon intensity":17.19,
      "industry":"Semiconductors & Semiconductor Equipment"
  },
  {
      "name":"1 DVD Software Package",
      "description":"Field not included in 2013 data",
      "Carbon intensity":14.11,
      "industry":"Software"
  },
  {
      "name":"DVD software",
      "description":"The products that are delivered on a single DVD, such as AutoCAD.",
      "Carbon intensity":14.11,
      "industry":"Software"
  },
  {
      "name":"DVD software (1 DVD)",
      "description":"The products that are delivered on a single DVD, such as AutoCAD.",
      "Carbon intensity":14.11,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"USB Software",
      "description":"Field not included in 2013 data",
      "Carbon intensity":268.82,
      "industry":"Software"
  },
  {
      "name":"USB software",
      "description":"The products that are delivered on a USB, such as many of our suites, which include multiple pieces of software on one USB.",
      "Carbon intensity":269.41,
      "industry":"Software"
  },
  {
      "name":"USB software",
      "description":"The products that are delivered on a USB, such as many of our suites, which include multiple pieces of software on one USB.",
      "Carbon intensity":269.41,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"DVD software (2 DVDs)",
      "description":"The products that are delivered on a 2 DVDs, such as a few of our suites.",
      "Carbon intensity":9.2,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Filtro 26 WS",
      "description":"Plug wrap paper of 26 gr\/m2 basis weight.",
      "Carbon intensity":3.0,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Dell Laptop",
      "description":"Field not included in 2013 data",
      "Carbon intensity":137.93,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Kimberley-Clark toilet tissue, 10,000 sheets",
      "description":"Field not included in 2013 data",
      "Carbon intensity":4.76,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Paraformaldehyde",
      "description":"Chemicals",
      "Carbon intensity":0.4,
      "industry":"Chemicals"
  },
  {
      "name":"Methacrylic acid",
      "description":"Chemicals",
      "Carbon intensity":3.55,
      "industry":"Chemicals"
  },
  {
      "name":"Hydrogen peroxide",
      "description":"Chemicals",
      "Carbon intensity":0.2,
      "industry":"Chemicals"
  },
  {
      "name":"Amines",
      "description":"Chemicals",
      "Carbon intensity":0.89,
      "industry":"Chemicals"
  },
  {
      "name":"Peroxides",
      "description":"Chemicals",
      "Carbon intensity":1.68,
      "industry":"Chemicals"
  },
  {
      "name":"Super-pure hydrogen peroxide",
      "description":"cleaning chemical",
      "Carbon intensity":0.36,
      "industry":"Chemicals"
  },
  {
      "name":"ELM",
      "description":"cleaning chemical",
      "Carbon intensity":0.87,
      "industry":"Chemicals"
  },
  {
      "name":"TCDE",
      "description":"Chemicals",
      "Carbon intensity":8.26,
      "industry":"Chemicals"
  },
  {
      "name":"Zinc Oxide",
      "description":"Rubber Vulcanization Acceleration Aid",
      "Carbon intensity":0.28,
      "industry":"Aerospace & Defense"
  },
  {
      "name":"500ml Coors Light brewed in the UK (steal can) CO2e expressed in CO2e\/ hl",
      "description":"500ml Coors Light brewed in the UK (steal can) CO2e expressed in CO2e\/ hl",
      "Carbon intensity":0.31,
      "industry":"Beverages"
  },
  {
      "name":"Carling brewed in the UK, 24 440ml cans in 4 packs",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.25,
      "industry":"Beverages"
  },
  {
      "name":"Carling brewed in the UK, 24 440ml cans in 4 packs",
      "description":"Carling brewed in the UK, 24 440ml cans in 4 packs.",
      "Carbon intensity":0.26,
      "industry":"Beverages"
  },
  {
      "name":"Carling brewed in the UK, 24 568ml cans in 4 packs",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.13,
      "industry":"Beverages"
  },
  {
      "name":"Carling brewed in the UK, 24 568ml cans in 4 packs",
      "description":"Carling brewed in the UK, 24 568ml cans in 4 packs.",
      "Carbon intensity":0.13,
      "industry":"Beverages"
  },
  {
      "name":"Coors Light brewed in the UK, 24 500ml cans in 4 packs",
      "description":"Coors light brewed in the UK, sold in 24 500ml steel cans in 4 packs.",
      "Carbon intensity":0.27,
      "industry":"Beverages"
  },
  {
      "name":"Server",
      "description":"IT equipment",
      "Carbon intensity":82.99,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Broadband Routers",
      "description":"IT equipment",
      "Carbon intensity":68.63,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Mobile Network Equipment",
      "description":"IT equipment",
      "Carbon intensity":532.83,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"1 dl cup of spray dried soluble Nescaf\u00c3\u00a9 coffee ready to be drunk, at the consumer\u00c2\u0092s home",
      "description":"1 dl cup of spray dried soluble Nescaf\u00c3\u00a9 coffee ready to be drunk, at the consumer\u00c2\u0092s home",
      "Carbon intensity":0.7,
      "industry":"Food Products"
  },
  {
      "name":"Nescaf\u00c3\u00a9 soluble coffee",
      "description":"1 dl cup of spray dried soluble Nescaf\u00c3\u00a9 coffee ready to be drunk, at the consumer\u00c2\u0092s home",
      "Carbon intensity":0.32,
      "industry":"Food Products"
  },
  {
      "name":"Nescaf\u00c3\u00a9 soluble coffee",
      "description":"1 dl cup of spray dried soluble Nescaf\u00c3\u00a9 coffee ready to be drunk, at the consumer\u00c2\u0092s home",
      "Carbon intensity":0.32,
      "industry":"Food & Beverage"
  },
  {
      "name":"Nescaf\u00c3\u00a9 soluble coffee",
      "description":"120 ml cup of spray dried soluble Nescaf\u00c3\u00a9 coffee ready to be drunk, at the consumer\u00c2\u0092s home",
      "Carbon intensity":0.43,
      "industry":"Beverages"
  },
  {
      "name":"EcoShape  bottle of water (0.5 L): Serving of 500 ml of hydration to the consumer. The study examines the extraction and processing of all upstream raw materials to produce the products and packaging components; the manufacturing process; distribution logistics; product use and packaging disposal. The work has been conducted using the Ecoinvent database and SimaPro software.  Climate change impacts are measured in kg CO2 equivalents, following the IPCC\u00c2\u0092s most recent methodology).  Scenario evaluations have been used to examine the importance of several variables in the product comparison. These include a range of possible consumer behaviours regarding the use of the products, such as conditions of refrigeration, washing of glasses, and disposal routes for packaging, among others.",
      "description":"EcoShape  bottle of water (0.5 L): Serving of 500 ml of hydration to the consumer. The study examines the extraction and processing of all upstream raw materials to produce the products and packaging components; the manufacturing process; distribution logistics; product use and packaging disposal. The work has been conducted using the Ecoinvent database and SimaPro software.  Climate change impacts are measured in kg CO2 equivalents, following the IPCC\u00c2\u0092s most recent methodology).  Scenario evaluations have been used to examine the importance of several variables in the product comparison. These include a range of possible consumer behaviours regarding the use of the products, such as conditions of refrigeration, washing of glasses, and disposal routes for packaging, among others.",
      "Carbon intensity":0.26,
      "industry":"Food Products"
  },
  {
      "name":"EcoShape  bottle of water (0.5 L)",
      "description":"Serving of 500 ml of hydration to the consumer. The study examined the extraction and processing of all upstream raw materials to produce the products and packaging components; the manufacturing process; distribution logistics; product use and packaging disposal. The work has been conducted using the Ecoinvent database and SimaPro software.  Climate change impacts are measured in kg CO2 equivalents, following the IPCC\u00c2\u0092s most recent methodology).  Scenario evaluations have been used to examine the importance of several variables in the product comparison. These include a range of possible consumer behaviours regarding the use of the products, such as conditions of refrigeration, washing of glasses, and disposal routes for packaging, among others.",
      "Carbon intensity":0.26,
      "industry":"Food Products"
  },
  {
      "name":"EcoShape bottle of water (0.5 L)",
      "description":"Serving of 500 ml of hydration to the consumer. The study examined the extraction and processing of all upstream raw materials to produce the products and packaging components; the manufacturing process; distribution logistics; product use and packaging disposal. The work has been conducted using the Ecoinvent database and SimaPro software. Climate change impacts are measured in kg CO2 equivalents, following the IPCC\u00c2\u0092s most recent methodology). Scenario evaluations have been used to examine the importance of several variables in the product comparison. These include a range of possible consumer behaviours regarding the use of the products, such as conditions of refrigeration, washing of glasses, and disposal routes for packaging, among others.",
      "Carbon intensity":0.26,
      "industry":"Food & Beverage"
  },
  {
      "name":"EcoShape bottle of water (0.5 L)",
      "description":"Serving of 500 ml of hydration to the consumer. The study examined the extraction and processing of all upstream raw materials to produce the products and packaging components; the manufacturing process; distribution logistics; product use and packaging disposal. The work has been conducted using the Ecoinvent database and SimaPro software. Climate change impacts are measured in kg CO2 equivalents, following the IPCC\u00c2\u0092s most recent methodology). Scenario evaluations have been used to examine the importance of several variables in the product comparison. These include a range of possible consumer behaviours regarding the use of the products, such as conditions of refrigeration, washing of glasses, and disposal routes for packaging, among others.",
      "Carbon intensity":0.26,
      "industry":"Beverages"
  },
  {
      "name":"Nestl\u00c3\u00a9 Babyfood NaturNes packaging - plastic pot The good assessed:\" Packaging systems used to provide one baby food meal in France, Spain, and Germany\". The 200-g packaging size was selected as the basis for this study. (The total emissions in kg CO2-e per unit provided [in this report] is the figure for France as it is not possible to list all three data in one cell. Please find detail by country and life cycle stages in questiom SM3.2.b",
      "description":"Nestl\u00c3\u00a9 Babyfood NaturNes packaging - plastic pot The good assessed:\" Packaging systems used to provide one baby food meal in France, Spain, and Germany\". The 200-g packaging size was selected as the basis for this study. (The total emissions in kg CO2-e per unit provided to the right of this cell is the figure for France as it is not possible to list all three data in one cell. Please find detail by country and life cycle stages in questiom SM3.2.b",
      "Carbon intensity":9.2,
      "industry":"Food Products"
  },
  {
      "name":"Nestl\u00c3\u00a9 Babyfood NaturNes packaging - plastic pot The good assessed:\" Packaging systems used to provide one baby food meal in France, Spain, and Germany\". The 200-g packaging size was selected as the basis for this study. (The total emissions in kg CO2-e per unit provided [in this report] is the figure for France as it is not possible to list all three data in one cell. Please find detail by country and life cycle stages in questiom SM3.2.b",
      "description":"Nestl\u00c3\u00a9 Babyfood NaturNes packaging - plastic pot The good assessed:\" Packaging systems used to provide one baby food meal in France, Spain, and Germany\". The 200-g packaging size was selected as the basis for this study. (The total emissions in kg CO2-e per unit provided to the right of this cell is the figure for France as it is not possible to list all three data in one cell. Please find detail by country and life cycle stages in questiom SM3.2.b",
      "Carbon intensity":7.15,
      "industry":"Food Products"
  },
  {
      "name":"Nestl\u00c3\u00a9 Babyfood NaturNes packaging - plastic pot The good assessed:\" Packaging systems used to provide one baby food meal in France, Spain, and Germany\". The 200-g packaging size was selected as the basis for this study. (The total emissions in kg CO2-e per unit provided [in this report] is the figure for France as it is not possible to list all three data in one cell. Please find detail by country and life cycle stages in questiom SM3.2.b",
      "description":"Nestl\u00c3\u00a9 Babyfood NaturNes packaging - plastic pot The good assessed:\" Packaging systems used to provide one baby food meal in France, Spain, and Germany\". The 200-g packaging size was selected as the basis for this study. (The total emissions in kg CO2-e per unit provided to the right of this cell is the figure for France as it is not possible to list all three data in one cell. Please find detail by country and life cycle stages in questiom SM3.2.b",
      "Carbon intensity":6.25,
      "industry":"Food Products"
  },
  {
      "name":"Average mobile phone",
      "description":"Field not included in 2013 data",
      "Carbon intensity":55.05,
      "industry":"Communications Equipment"
  },
  {
      "name":"Mobile phone",
      "description":"Nokia produce a wide range of mobile & smart phones and we have calculated the related emissions and publish the information for each of the model in our product related web pages. Here we have provided data onG HG emissions related to an average product.",
      "Carbon intensity":55.05,
      "industry":"Communications Equipment"
  },
  {
      "name":"Nokia Lumia 800. Nokia's high end smart phone, mass = 142 g including battery.",
      "description":"Nokia Lumia 800. Nokia's high end smart phone, mass = 142 g including battery.",
      "Carbon intensity":112.68,
      "industry":"Communications Equipment"
  },
  {
      "name":"Nokia Asha 300. Nokia's low end device, mass = 85 g incluging battery.",
      "description":"Nokia Asha 300. Nokia's low end device, mass = 85 g incluging battery.",
      "Carbon intensity":94.12,
      "industry":"Communications Equipment"
  },
  {
      "name":"ECU",
      "description":"Fuel Pump ECU",
      "Carbon intensity":7.08,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Laser radar",
      "description":"Laser radar",
      "Carbon intensity":64.33,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Blood Pressure Monitor HEM-7113",
      "description":"BLANK",
      "Carbon intensity":51.76,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Power window switch",
      "description":"Power window switch",
      "Carbon intensity":20.0,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Safety controller",
      "description":"Safety controllerDST1",
      "Carbon intensity":3.85,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Switch",
      "description":"Limit switch",
      "Carbon intensity":0.28,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Keyless Entry System for Automobiles(Transmitter + Receiver unit)",
      "description":"BLANK",
      "Carbon intensity":80.0,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Signal Relay Type G6Zk-1F-TR",
      "description":"BLANK",
      "Carbon intensity":51.79,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Automotive Relay",
      "description":"Automotive Relay G83",
      "Carbon intensity":97.06,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Automotive Relay",
      "description":"G8W Automotive Mini 280 Relay",
      "Carbon intensity":32.35,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Automotive Relay",
      "description":"Power Relay G8HNJ",
      "Carbon intensity":17.65,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Blood Pressure Monitor",
      "description":"Upper arm automatic blood pressure monitor(About 250 grams)",
      "Carbon intensity":112.8,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"ECU",
      "description":"ECU",
      "Carbon intensity":7.08,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"City gas",
      "description":"The main components of Osaka Gas\u00c2\u0092s City gas are imported LNG + LPG for calorie adjust use, and so on.",
      "Carbon intensity":57.04,
      "industry":"Gas Utilities"
  },
  {
      "name":"City gas",
      "description":"The main components of Osaka Gas\u00c2\u0092s City gas are imported LNG + LPG for calorie adjust use, and so on.",
      "Carbon intensity":57.04,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"City gas",
      "description":"The main components of Osaka Gas\u00c2\u0092s City gas are imported LNG +LPG for calorie adjust use,and so on.",
      "Carbon intensity":57.1,
      "industry":"Gas Utilities"
  },
  {
      "name":"Walkers Crisps 32.5 g sold in the United Kingdom",
      "description":"Field not included in 2013 data",
      "Carbon intensity":2.46,
      "industry":"Beverages"
  },
  {
      "name":"Walkers Crisps 32.5 g sold in the United Kingdom",
      "description":"Life Cycle Carbon Footprint for PepsiCo\u00c2\u0092s Walkers Crisps 32.5 g sold in the United Kingdom.",
      "Carbon intensity":2.46,
      "industry":"Beverages"
  },
  {
      "name":"Walkers Crisps 32.5 g sold in the United Kingdom",
      "description":"Life Cycle Carbon Footprint for PepsiCo\u00c2\u0092s Walkers Crisps 32.5 g sold in the United Kingdom.",
      "Carbon intensity":2.46,
      "industry":"Food & Beverage"
  },
  {
      "name":"Walkers Crisps 50g bag sold in the United Kingdom",
      "description":"Field not included in 2013 data",
      "Carbon intensity":2.4,
      "industry":"Beverages"
  },
  {
      "name":"Walkers Crisps 50g bag sold in the United Kingdom",
      "description":"Life Cycle Carbon Footprint for PepsiCo\u00c2\u0092s Walkers Crisps 50g bag sold in the United Kingdom",
      "Carbon intensity":2.4,
      "industry":"Beverages"
  },
  {
      "name":"Walkers Crisps 50g bag sold in the United Kingdom",
      "description":"Life Cycle Carbon Footprint for PepsiCo\u00c2\u0092s Walkers Crisps 50g bag sold in the United Kingdom",
      "Carbon intensity":2.4,
      "industry":"Food & Beverage"
  },
  {
      "name":"Quaker Oats 1Kg box sold in the United Kingdom",
      "description":"Field not included in 2013 data",
      "Carbon intensity":1.75,
      "industry":"Beverages"
  },
  {
      "name":"Quaker Oats 1Kg box sold in the United Kingdom",
      "description":"Life Cycle Carbon Footprint for PepsiCo\u00c2\u0092s Quaker Oats 1Kg box sold in the United Kingdom.",
      "Carbon intensity":1.75,
      "industry":"Beverages"
  },
  {
      "name":"Quaker Oats 1Kg box sold in the United Kingdom",
      "description":"Life Cycle Carbon Footprint for PepsiCo\u00c2\u0092s Quaker Oats 1Kg box sold in the United Kingdom.",
      "Carbon intensity":1.75,
      "industry":"Food & Beverage"
  },
  {
      "name":"Quaker Oats So Simple Original and Golden Syrup products",
      "description":"Quaker Oats So Simple Original and Golden Syrup products",
      "Carbon intensity":2.01,
      "industry":"Beverages"
  },
  {
      "name":"Quaker Oats So Simple Original and Golden Syrup products",
      "description":"Life Cycle Carbon Footprint for PepsiCo\u00c2\u0092s Quaker Oats So Simple Original & Golden Syrup Products",
      "Carbon intensity":2.01,
      "industry":"Beverages"
  },
  {
      "name":"Quaker Oats So Simple Original and Golden Syrup products",
      "description":"Life Cycle Carbon Footprint for PepsiCo\u00c2\u0092s Quaker Oats So Simple Original & Golden Syrup Products",
      "Carbon intensity":2.01,
      "industry":"Food & Beverage"
  },
  {
      "name":"HH DVD",
      "description":"Field not included in 2013 data",
      "Carbon intensity":281.09,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"power supply unit (MF6004-030L)",
      "description":"Field not included in 2013 data",
      "Carbon intensity":135.61,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"CD-ROM",
      "description":"Field not included in 2013 data",
      "Carbon intensity":17.86,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"CD-ROM",
      "description":"CD-ROM",
      "Carbon intensity":132.28,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"LED Lighting",
      "description":"Dimensions: 798*225*569mm, Power Consumption: 12W (Max.), Gross weight with packageing: 6.3Kg, Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":5.29,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Projector",
      "description":"Lamp: UHP-196W MKII, Gross weight with packageing: 2.8Kg, Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":31.77,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"19\u00c2\u0094 LCD Monitor  Weight: 2.4Kg  Diagonal size: 19\"  Power consumption: <16.25W (on mode), <0.72W (power saving mode), <0.53W (off mode) Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "description":"19\u00c2\u0094 LCD Monitor  Weight: 2.4Kg  Diagonal size: 19\"  Power consumption: <16.25W (on mode), <0.72W (power saving mode), <0.53W (off mode) Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":29.18,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Mobile Phone",
      "description":"Screen diagonal size:4.5\" gHD,  Power Consumption: 2W,  Gross weight with packageing: 0.31Kg, Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":62.52,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Monitor",
      "description":"24\u00c2\u0094 LCD Monitor,  Gross weight with packaging: 7.4 Kg, Screen diagonal size: 24\", Power consumption: <40W (on mode), <0.5W (standby mode), <0.3W (off mode), Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":8.94,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Monitor",
      "description":"24\u00c2\u0094 LCD Monitor,  Gross weight with packaging: 5.8 Kg, Screen diagonal size: 24\", Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":12.9,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Projector",
      "description":"Lamp: VIP 190W, Gross weight with packaging: 3.4Kg, Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":24.46,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Projector",
      "description":"Lamp: VIP 240W, Gross weight with packaging: 4.4Kg, Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":22.65,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Mobile Phone",
      "description":"Display diagonal size:5\" HD, IPS. Battery: 2520mAh,  Gross weight with packaging: 0.35Kg, Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":152.46,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Mobile Phone",
      "description":"Display diagonal size: 5.2\" FHD, IPS. Battery: 2520mAh,  Gross weight with packaging: 0.35Kg, Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":46.31,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"LED Lighting",
      "description":"Dimensions: 90*1500*90mm(W*D*H), LED spec: Nichia 3030 3000~3500K, Power Consumption: 36W (Max.), Gross weight with packaging: 8.2Kg, Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":8.43,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"LED Lighting",
      "description":"Dimensions: 590*220*625mm(W*D*H), LED spec: LEXTAR LBL1201 V0 2700K, 5700K, Power Consumption: 18W (Max.), Gross weight with packaging: 5.8Kg, Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":4.14,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Industrial Solutions",
      "description":"LCD screen diagonal size: 27\", Gross weight with packaging: 14.2 Kg, Power consumption: 80W(full load), Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":10.31,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Industrial Solutions",
      "description":"LCD screen diagonal size: 475.2mm*267.3mm, Gross weight with packaging: 7 Kg, Power consumption: 64.4W, Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":9.45,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Projector  Weight: 7.5Kg Lamp: 24 pcs laser with phosphor Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide.",
      "description":"Projector  Weight: 7.5Kg Lamp: 24 pcs laser with phosphor Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide.",
      "Carbon intensity":24.39,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Mobile phone Weight: 0.11kg Screen Diagonal: 3.7\" WVGA (800*480) 16M Color TFT-LCD Power Consumption: Standby time(1300m Ah): Up to 4 hrs depends on real-network Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide.",
      "description":"Mobile phone Weight: 0.11kg Screen Diagonal: 3.7\" WVGA (800*480) 16M Color TFT-LCD Power Consumption: Standby time(1300m Ah): Up to 4 hrs depends on real-network Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide.",
      "Carbon intensity":170.51,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Digital Photo Frame Weight: 0.8 kg Diagonal size: 7D Overall Dimension: 238*202*39.7mm Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide.",
      "description":"Digital Photo Frame Weight: 0.8 kg Diagonal size: 7D Overall Dimension: 238*202*39.7mm Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide.",
      "Carbon intensity":31.9,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Scanner  Weight: 1.4 kg Power supply: 12V\/1.5A Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide.",
      "description":"Scanner  Weight: 1.4 kg Power supply: 12V\/1.5A Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide.",
      "Carbon intensity":14.92,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Monitor",
      "description":"27\u00c2\u0094 LCD Monitor,  Gross weight with packageing: 11 Kg, Diagonal size: 27\", Power consumption: <35W (on mode), <0.5W (power saving mode), <0.5W (off mode), Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":9.6,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"42' Industrial Solutions",
      "description":"LCD screen diagonal size: 41.92\", Gross weight with packageing: 23 Kg, Power consumption: 54.85W, Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":7.59,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Mobile Infotainment",
      "description":"Overall Dimension: 202mm*122mm*12mm, Gross weight with packageing: 0.7 Kg, Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":36.74,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Surveillance Camera & Products",
      "description":"Imaging Device: 1\/6.9-inch, Minimum Illumination: 3Lux, Gross weight with packageing: 0.162 Kg, Excluded from the study of carbon footprint of product were CD?Manual and Quick Start Guide",
      "Carbon intensity":37.84,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"BlackBerry Bold 9900",
      "description":"Field not included in 2013 data",
      "Carbon intensity":401.54,
      "industry":"Wireless Telecommunication Services"
  },
  {
      "name":"BlackBerry Z10",
      "description":"Touchscreen Smartphone",
      "Carbon intensity":415.27,
      "industry":"Communications Equipment"
  },
  {
      "name":"BlackBerry Passport",
      "description":"Smartphone",
      "Carbon intensity":317.56,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"BlackBerry Passport",
      "description":"Smartphone in a fiber-based package",
      "Carbon intensity":317.56,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"BlackBerry Classic",
      "description":"Smartphone in a fiber-based package",
      "Carbon intensity":352.81,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"BlackBerry Priv",
      "description":"Smartphone in a fiber-based package",
      "Carbon intensity":416.15,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Ricoh SP C352DN",
      "description":"Ricoh SP C352DN is a 30 prints\/minute Full color printer with A4\/Letter size paper size print and automatic duplex capability. The emissions data of this product is provided as a case example of our entire image solution business products line.",
      "Carbon intensity":49.7,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Ricoh Aficio MP 6002SP, a Mono-chrome MFP (Multi-function products) products that function as Copier, Network Printer, Scanner, (Facsimile).",
      "description":"Ricoh Aficio MP 6002SP, a Mono-chrome MFP (Multi-function products) products that function as Copier, Network Printer, Scanner, (Facsimile).",
      "Carbon intensity":11.21,
      "industry":"Office Electronics"
  },
  {
      "name":"Ricoh Aficio MP C5502G, a Full-color MFP (Multi-function products) products that function as Copier, Network Printer, Scanner, (Facsimile).",
      "description":"Ricoh Aficio MP C5502G, a Full-color MFP (Multi-function products) products that function as Copier, Network Printer, Scanner, (Facsimile).",
      "Carbon intensity":16.15,
      "industry":"Office Electronics"
  },
  {
      "name":"Ricoh Aficio SP 8300DN, a high-speed Mono-chrome Network Printer",
      "description":"Ricoh Aficio SP 8300DN, a high-speed Mono-chrome Network Printer",
      "Carbon intensity":17.77,
      "industry":"Office Electronics"
  },
  {
      "name":"Ricoh Aficio SP C831DN, a high-speed Full-colour Network Printer",
      "description":"Ricoh Aficio SP C831DN, a high-speed Full-colour Network Printer",
      "Carbon intensity":33.09,
      "industry":"Office Electronics"
  },
  {
      "name":"Ricoh Pro C751EX, a Production Printer (Full Color) that is used primarily for high-speed and production type (large print volume) job",
      "description":"Ricoh Pro C751EX, a Production Printer (Full Color) that is used primarily for high-speed and production type (large print volume) job",
      "Carbon intensity":13.4,
      "industry":"Office Electronics"
  },
  {
      "name":"Ricoh MP C5503",
      "description":"Ricoh MP C5503 is a hi-speed color MFP (Multi-function product) with; - Colour output at 55 pages a minute - Single Pass Duplex Feeder - Wide selection of finishing options - SRA3 media handling  The emissions data of this product is provided as a case example of our entire image solution business products line which covers 77% of Ricoh's total revenue.",
      "Carbon intensity":19.42,
      "industry":"Office Electronics"
  },
  {
      "name":"Ricoh MP C8002SP: The product is a high-speed (80 images\/minute) color multi-functional product (MFP) and is a major representative of our image solution products business.  The lifecycle emissions data of this product is provided as a case example of our entire image solution business products line which covers 77% of Ricoh's total revenue.",
      "description":"BLANK",
      "Carbon intensity":25.48,
      "industry":"Office Electronics"
  },
  {
      "name":"Ricoh MP 6054SPG",
      "description":"Ricoh MP 6054SPG is a high-speed color MFP (Multi-function product) with; - Colour output at 60 pages a minute - Single Pass Duplex Feeder - Wide selection of finishing options. The emissions data of this product is provided as a case example of our entire image solution business products line which covers 89% of Ricoh's total revenue.",
      "Carbon intensity":17.97,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"RICOH Pro C7110S QX100",
      "description":"BLANK",
      "Carbon intensity":13.47,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"SBS Board",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.97,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"AlgroDesign",
      "description":"SBS Board",
      "Carbon intensity":1.03,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"One side coated label paper",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.95,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Parade Prima",
      "description":"One side coated label paper",
      "Carbon intensity":1.04,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Uncoated flexible packaging paper",
      "description":"Field not included in 2013 data",
      "Carbon intensity":1.03,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Leine M\u00c3\u00bchle, Leine Silk",
      "description":"Uncoated flexible packaging paper",
      "Carbon intensity":1.06,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"One side coated flexible packaging paper",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.97,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Algro Helix",
      "description":"One side coated flexible packaging paper",
      "Carbon intensity":1.08,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Acti9 \u00c2\u0096 Residual current circuit breaker \u00c2\u0096 iID K. The main function of the iID K product range is to ensure protection of people against electric shocks. PEP of this product is available here: http:\/\/planet.schneider-electric.com\/C12577A200268439\/all\/14AA652B755F340C852577F3006F06D0\/$File\/envpep100201en.pdf",
      "description":"Acti9 \u00c2\u0096 Residual current circuit breaker \u00c2\u0096 iID K. The main function of the iID K product range is to ensure protection of people against electric shocks. PEP of this product is available here: http:\/\/planet.schneider-electric.com\/C12577A200268439\/all\/14AA652B755F340C852577F3006F06D0\/$File\/envpep100201en.pdf",
      "Carbon intensity":90.95,
      "industry":"Electrical Equipment"
  },
  {
      "name":"ACTI9 IID K 2P 40A 30MA AC-TYPE RESIDUAL CURRENT CIRCUIT BREAKER",
      "description":"The data provided in this question is an example for a product which possesses a Product Environmental Profile: Acti9 \u00c2\u0096 Residual current circuit breaker \u00c2\u0096 ilD K. The main function of the ilD K product range is to ensure protection of people against electric shocks. PEP of this product is available here: http:\/\/www2.schneider-electric.com\/sites\/corporate\/en\/products-services\/green-premium\/check-a-product.page -> checking reference \"A9R50240\".",
      "Carbon intensity":90.95,
      "industry":"Electrical Equipment"
  },
  {
      "name":"ACTI9 IID K 2P 40A 30MA AC-TYPE RESIDUAL CURRENT CIRCUIT BREAKER",
      "description":"The data provided in this question is an example for a product which possesses a Product Environmental Profile: Acti9 \u00c2\u0096 Residual current circuit breaker \u00c2\u0096 ilD K. The main function of the ilD K product range is to ensure protection of people against electric shocks. PEP of this product is available here: http:\/\/www2.schneider-electric.com\/sites\/corporate\/en\/products-services\/green-premium\/check-a-product.page -> checking reference \"A9R50240\".",
      "Carbon intensity":90.95,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"ACTI9 IID K 2P 40A 30MA AC-TYPE RESIDUAL CURRENT CIRCUIT BREAKER",
      "description":"The data provided in this question is an example for a product which possesses a Product Environmental Profile: Acti9 \u00c2\u0096 Residual current circuit breaker \u00c2\u0096 ilD K. The main function of the ilD K product range is to ensure protection of people against electric shocks. PEP of this product is available here: https:\/\/www.reach.schneider-electric.com\/CheckProduct.aspx -> checking reference \"A9R50240\".",
      "Carbon intensity":291.57,
      "industry":"Electrical Equipment"
  },
  {
      "name":"Corrugated box",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.75,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Corrugated Box",
      "description":"Production of corrugated box (including production of raw materials used, fuels consumption, electricity consumption, transport of raw materials)",
      "Carbon intensity":0.75,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Corrugated box",
      "description":"Production of corrugated box, including production of raw materials, fuel consumption, electricity consumption and transport of raw materials",
      "Carbon intensity":0.75,
      "industry":"Packaging for consumer goods"
  },
  {
      "name":"Board packaging",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.96,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Solid Board",
      "description":"Production of solid board packaging (including production of raw materials used, fuels consumption, electricity consumption, transport of raw materials)",
      "Carbon intensity":0.96,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Solid Board",
      "description":"Production of solid board for packaging, including production of raw materials, fuel consumption, electricity consumption and transport of raw materials",
      "Carbon intensity":0.96,
      "industry":"Packaging for consumer goods"
  },
  {
      "name":"Sodium Carbonate",
      "description":"Soda Ash Dense is the grade for glass manufacture Soda Ash Light for detergent and chemical applications.",
      "Carbon intensity":1.32,
      "industry":"Chemicals"
  },
  {
      "name":"Sodium Bicarbonate",
      "description":"Sodium bicarbonate serves primarily the food and feed markets and the health sector, and is also used to neutralize acid flue gases",
      "Carbon intensity":1.1,
      "industry":"Chemicals"
  },
  {
      "name":"Sodium Bicarbonate",
      "description":"Sodium bicarbonate serves primarily the food and feed markets and the health sector, and is also used to neutralize acid flue gases",
      "Carbon intensity":1.01,
      "industry":"Chemicals"
  },
  {
      "name":"Sodium Bicarbonate",
      "description":"Sodium bicarbonate serves primarily the food and feed markets and the health sector, and is also used to neutralize acid flue gases",
      "Carbon intensity":1.01,
      "industry":"Chemicals"
  },
  {
      "name":"Dense Sodium Carbonate",
      "description":"Soda Ash Dense is the grade for glass manufacture",
      "Carbon intensity":1.29,
      "industry":"Chemicals"
  },
  {
      "name":"Dense Sodium Carbonate",
      "description":"Soda Ash Dense is the grade for glass manufacture",
      "Carbon intensity":1.29,
      "industry":"Chemicals"
  },
  {
      "name":"Light Sodium Carbonate",
      "description":"Soda Ash Light for detergent and chemical applications.",
      "Carbon intensity":1.19,
      "industry":"Chemicals"
  },
  {
      "name":"Light Sodium Carbonate",
      "description":"Soda Ash Light for detergent and chemical applications.",
      "Carbon intensity":1.19,
      "industry":"Chemicals"
  },
  {
      "name":"Staples Sustainable Earth 12A toner cartridge",
      "description":"The Sustainable Earth by Staples\u00c2\u0099 12A toner is the remanufactured toner cartridge counterpart to the Hewlett Packard Company LaserJet Q2612A (12A) toner cartridge. A toner cartridge is a consumable component of a laser printer. The toner cartridge contains the toner, which is a fine, dry powder mixture that makes the actual image on the paper. The toner is transferred to paper via an electrostatic charge, and fused onto the paper during the printing process.",
      "Carbon intensity":3.09,
      "industry":"Specialty Retail"
  },
  {
      "name":"Staples Sustainable Earth 12A toner cartridge",
      "description":"The Sustainable Earth by Staples\u00c2\u0099 12A toner is the remanufactured toner cartridge counterpart to the Hewlett Packard Company LaserJet Q2612A (12A) toner cartridge. A toner cartridge is a consumable component of a laser printer. The toner cartridge contains the toner, which is a fine, dry powder mixture that makes the actual image on the paper. The toner is transferred to paper via an electrostatic charge, and fused onto the paper during the printing process.",
      "Carbon intensity":3.09,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Staples Sustainable Earth 38A toner cartridge",
      "description":"The Sustainable Earth by Staples\u00c2\u0099 12A toner is the remanufactured toner cartridge counterpart to the Hewlett Packard Company LaserJet Q1338A (38A) toner cartridge. A toner cartridge is a consumable component of a laser printer. The toner cartridge contains the toner, which is a fine, dry powder mixture that makes the actual image on the paper. The toner is transferred to paper via an electrostatic charge, and fused onto the paper during the printing process.",
      "Carbon intensity":10.25,
      "industry":"Specialty Retail"
  },
  {
      "name":"Staples Sustainable Earth 38A toner cartridge",
      "description":"The Sustainable Earth by Staples\u00c2\u0099 12A toner is the remanufactured toner cartridge counterpart to the Hewlett Packard Company LaserJet Q1338A (38A) toner cartridge. A toner cartridge is a consumable component of a laser printer. The toner cartridge contains the toner, which is a fine, dry powder mixture that makes the actual image on the paper. The toner is transferred to paper via an electrostatic charge, and fused onto the paper during the printing process.",
      "Carbon intensity":10.25,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"D21710 Type 5 Corded Power Drill",
      "description":"D21710 Type 5 Corded Power Drill",
      "Carbon intensity":30.59,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"D21710 Type 5 Corded Power Drill",
      "description":"D21710 Type 5 Corded Power Drill",
      "Carbon intensity":30.59,
      "industry":"Electrical Equipment"
  },
  {
      "name":"DC988 Type 11 Cordless Power Drill equipment with rechargeable NiCd batteries",
      "description":"DC988 Type 11 Corded Power Drill equipment with rechargeable NiCd batteries",
      "Carbon intensity":32.64,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"Cordless Power Drill ",
      "description":"DC988 Type 11 Cordless Power Drill equipment with rechargeable NiCd batteries",
      "Carbon intensity":32.64,
      "industry":"Electrical Equipment"
  },
  {
      "name":"33-725 Tape measure family",
      "description":"FatMax 25 foot tape measure",
      "Carbon intensity":4.3,
      "industry":"Electrical Equipment"
  },
  {
      "name":"B-Free small cube (European supply chain)",
      "description":"B-Free range welcomes varied work postures -reading, reclining, or leaning in to a conversation. From focused individual work to a casual meeting, B-Free provides thoughtful, comfortable support. Small cube allows nearby informal seating during the work day.The model chosen for analysis is the most representative one (reference N3L C00 010)from the B-Free range.",
      "Carbon intensity":1.76,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"B-Free Table (European supply chain)",
      "description":"B-Free range welcomes varied work postures - reading, reclining, or leaning in to a conversation. From focused individual work to a casual meeting, B-Free provides thoughtful, comfortable support. The model chosen for analysis is the most representative one (reference N3L TW0 220) from the B-Free range.",
      "Carbon intensity":2.9,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Let\u00c2\u0092s B task chair",
      "description":"Let\u00c2\u0092s B task chair range offers two versions : Let\u00c2\u0092s B mid backrest and Let\u00c2\u0092s B high backrest. The range is designed to provide three major benefits: \u00c2\u0093comfort\u00c2\u0094, \u00c2\u0093intuitivity\u00c2\u0094 and \u00c2\u0093personalization\u00c2\u0094. The model chosen for analysis is the most frequently ordered one (reference 469 IM 060) from the Let\u00c2\u0092s B mid backrest range.  Standard features on this model include: - Seat height adjustment - Seat depth adjustment - Back height adjustment - Tilt tension adjustment - Upright position lock - 2D adjustable armrests - Impress upholstery - Standard base",
      "Carbon intensity":6.07,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Let\u00c2\u0092s B task chair",
      "description":"Let\u00c2\u0092s B task chair range offers two versions : Let\u00c2\u0092s B mid backrest and Let\u00c2\u0092s B high backrest. The range is designed to provide three major benefits: \u00c2\u0093comfort\u00c2\u0094, \u00c2\u0093intuitivity\u00c2\u0094 and \u00c2\u0093personalization\u00c2\u0094. The model chosen for analysis is the most frequently ordered one (reference 469 IM 060) from the Let\u00c2\u0092s B mid backrest range.  Standard features on this model include: - Seat height adjustment - Seat depth adjustment - Back height adjustment - Tilt tension adjustment - Upright position lock - 2D adjustable armrests - Impress upholstery - Standard base",
      "Carbon intensity":6.07,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Eastside (European supply chain)",
      "description":"Eastside is a stackable visitor chair, with no sharp edges. It is easy to reconfigure \u00c2\u0096 ideal for conferencing, impromptu meeting and teaming tasks. As extra options, it can have armrests, a writing tablet and castors.The model chosen for analysis is the most frequently ordered one (reference 412 450 MH) from the Eastside range.",
      "Carbon intensity":4.7,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Flip Top Twin (European supply chain)",
      "description":"FlipTop Twin is a clever and flexible table for meeting or training rooms. It is very intuitive: the top can be flipped from both sides, to both sides. Once the top is flipped, the tables can be stored in a space saving way. The model chosen for analysis is the most frequently ordered one (reference W4D1C600) from the FlipTop Twin range.",
      "Carbon intensity":2.86,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"FrameOne Bench (European supply chain)",
      "description":"FrameOne Bench is a workstation with light and refined aesthetic. The same product line allows to create differentiated bench settings supporting more effectively the ways users work: - it offers an integrated sliding top. - it can be associated to work tools, lighting, screens and technology. - it features Bench applications with supporting storage - it provides efficient cable management solutions. The model chosen for analysis is the most frequently ordered one (reference W3G17700 and W3G27700) from the FrameOne Bench range. Standard features on this model include: - Top dimensions: 3200 mm x 1600 mm (5.12 m\u00c2\u00b2 \/ four tops of 1600 x 800 mm each) - Melamine top - Steel legs - Cable way for cable management.",
      "Carbon intensity":2.45,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Fusion (European supply chain)",
      "description":"Fusion is a desking family comprising work surfaces, storage, desk organization and cable management. Fusion is a platform system that structures the whole office space, no matter what work styles are needed. Fusion is flexible and can be assembled and reconfigured quickly. Its consolidated individual work spaces encourage collaborative working.The model chosen for analysis is the most frequently ordered one (Fusion ref. 616 000 100) from the Fusion range.",
      "Carbon intensity":2.03,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Gesture (European supply chain)",
      "description":"Gesture is the first chair designed to support our interactions with today\u00c2\u0092s technologies. Inspired by the human body. Created for the way we work today. Gesture has a synchronized system moving with each user to provide continuous and persistent support, offers unique arms which move like the human arm, allowing users to be supported in any position, possesses a seat that brings comfort all the way to the edges, and features a wide variety of adjustments allowing it to fit an important palette of users and spaces. The model chosen for analysis is the most representative line (reference 442A30) from the Gesture range.",
      "Carbon intensity":4.8,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Gesture (North American supply chain)",
      "description":"Gesture is is the first chair designed to support our interactions with today\u00c2\u0092s technologies. Inspired by the human body. Created for the way we work today. Gesture has a synchronized system moving with each user to provide continuous and persistent support, offers unique arms which move like the human arm, allowing users to be supported in any position, possesses a seat that brings comfort all the way to the edges, features a wide variety of adjustments allowing it to fit a important palette of users and spaces.The model chosen for analysis is the most representative one (reference 442A30) from the Gesture range.",
      "Carbon intensity":5.09,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Implicit (European supply chain)",
      "description":"Implicit is the new generation of personal storage which respond to all storage needs! The materials (steel, melamine and veneer) of the carcass, the top and the fronts can be chosen and mixed together in the Standard and Premium version. Mobile pedestals provide flexibility, juxtaposed pedestals create an extension of the worksurface and supporting replaces a leg of the desk. The model chosen for analysis is the most frequently ordered one (reference 785 M23 003) from the Implicit melamine range. Standard features on this model include: - Width 419 mm \/ height 566 mm \/ depth 788 mm - Storage space: 0.097 m3 - Fours drawers thus a pen tray - Melamine boards and fronts - A lock system with a key",
      "Carbon intensity":2.78,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Kalidro (European supply chain)",
      "description":"Simplicity and intelligence is the success of Kalidro. The 4 leg desk system offers a complete range that is easy to install and to configure. The comfortable height adjustment and the smart cable management fulfill customers\u00c2\u0092 demands.The model chosen for analysis is the most popular model (reference W3812700).",
      "Carbon intensity":1.39,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"The Activa desks are highly ergonomic and offer different height adjustable versions in a single design. Its modular construction allows very easy assembly and reconfiguration.  The model chosen for analysis is the most frequently ordered one (reference W6412700) from the Activa Telescopic range. Standard features on this model include: - Top dimensions: 1600 mm x 800 mm - Melamine top, Snow WY - Steel leg and frame, Pearl Snow ZW - Telescopic height adjustment from 620 mm to 900 mm - Steel cable tray.",
      "description":"The Activa desks are highly ergonomic and offer different height adjustable versions in a single design. Its modular construction allows very easy assembly and reconfiguration.  The model chosen for analysis is the most frequently ordered one (reference W6412700) from the Activa Telescopic range. Standard features on this model include: - Top dimensions: 1600 mm x 800 mm - Melamine top, Snow WY - Steel leg and frame, Pearl Snow ZW - Telescopic height adjustment from 620 mm to 900 mm - Steel cable tray.",
      "Carbon intensity":3.58,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Activa desk",
      "description":"The Activa desks are highly ergonomic and offer different height adjustable versions in a single design. Its modular construction allows very easy assembly and reconfiguration.  The model chosen for analysis is the most frequently ordered one (reference W6412700) from the Activa Telescopic range. Standard features on this model include: - Top dimensions: 1600 mm x 800 mm - Melamine top, Snow WY - Steel leg and frame, Pearl Snow ZW - Telescopic height adjustment from 620 mm to 900 mm - Steel cable tray.",
      "Carbon intensity":3.58,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Leap (European supply chain)",
      "description":"The Leap office chair is our most ergonomic chair. User tests show it reduces lower back pain, discomfort and musculo-skeletal disorders. That means it will increase your productivity by allowing you to sit more comfortably for longer. It\u00c2\u0092s all thanks to the Leap chair's advanced design with innovative features such as a flexible backrest, separate upper and lower back controls and a dynamic seat. The model chosen for analysis is the most frequently ordered task chair (model 462 200 MP) from the Leap seating range.",
      "Carbon intensity":3.35,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Let's B (European supply chain)",
      "description":"Let\u00c2\u0092s B task chair range offers two alternative styles to maximise choice in terms of design and functionality: Reply & Reply Air. The range is designed to provide four major benefits: \u00c2\u0093customisation\u00c2\u0094, \u00c2\u0093comfort\u00c2\u0094, \u00c2\u0093simplicity\u00c2\u0094 and \u00c2\u0093sustainability\u00c2\u0094. The model chosen for analysis is the most frequently ordered one(reference 466 160 MT) from the Reply range.",
      "Carbon intensity":5.71,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Movida (European supply chain)",
      "description":"Movida is simplicity itself. Rounded and welcoming, it is a flexible workstation createdfrom just a few components. It will fit anyapplication you ask of it. The models chosen for analysis offer the most popular Movida combination (reference 290000210)",
      "Carbon intensity":1.03,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"New Think (European supply chain)",
      "description":"New Think is a chair designed for the mobility of users in the workplace. It is smart, simple and sustainable. New Think is Smart: because it does the New Thinking for us. It fosters wellbeing through automatic ergonomic support thanks to its advanced weight activated mechanism and new membrane of flexors. It responds to our changing postures and body movements, allowing us to get to workfaster, making the most of our valuable sit time. Simple: because it is very easy to use. It anticipates our postures, while still giving users the freedom to customize it to their own personal preferences. Sustainable: because it can be easily disassembled with common hand tools making it easy to recycle at end of life, and it has undergone materials chemistry and develop with a life cycle vision to understand and minimize its lifelong impact on the environment. In addition, its back frame and base are composed of recycled materials (PA6) The model chosen for analysis is the most representative line (reference 465A300) from the New Think range.",
      "Carbon intensity":3.55,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Ology (European supply chain)",
      "description":"Ology is a desking family comprised of height adjustability options, work surfaces, desk organisation options and cable management. Ology offers various ergonomic and antimicrobial treatment options to create a more health-conscious work environment. The model chosen for analysis is the most representative line (reference N111012700) from the Ology range.",
      "Carbon intensity":2.32,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Partito (European supply chain)",
      "description":"Design and functionality is the key concept of Partito Screen. Clear shapes and straight lines make this screen a harmonious add-on to our desk lines. The enormous range of materials and colours provides individuality. At the same time Partito Screen helps organising your work place and provides visual, territorial and (coming soon) acoustic privacy. The model chosen for analysis is the most popular model (reference W93A1270 + Option: 38 + Option: 1SP)",
      "Carbon intensity":4.01,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Please (European supply chain)",
      "description":"The model chosen for analysis is the most popular model Please task chair (reference 468 200 MP). The task chair is a new generation of Please launched in June 1998. It is a highly adjustable ergonomic chair equipped as follows: 1. LTC2 (Lumbar-Thoracic-Cervical) mechanism 2. height adjustable backrest 3. lumbar tension adjustment 4. tilt tension adjustment 5. seat height adjustment by gaslift 6. 3D adjustable armrests (height, depth and pivot) 7. variable back stop \/ tilt limiter 8. seat depth adjustment 9. seat impact absorber",
      "Carbon intensity":3.85,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Qivi (European supply chain)",
      "description":"Smart and elegant, QiVi is the new meeting energizer! QiVi allows users to move and to change postures easily, bringing more comfort to meetings thanks to its automatic adjustments. The combination of the sliding seat and pivoting backrest makes QiVi unique and comfort immediate. QiVi offers a wide range of versions and finishes: 4 leg, sled, conference, with and without armrests; plain, upholstered or knitted back available in two different aesthetics, as well as several accessories that make the range even more complete! The model chosen for analysis is the most frequently ordered one (reference 428 LUG ET) from the QiVi range.",
      "Carbon intensity":10.83,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Reply (European supply chain)",
      "description":"Reply task chair range offers two alternative styles to maximise choice in terms of design and functionality: Reply & Reply Air. The range is designed to provide four major benefits: \u00c2\u0093customisation\u00c2\u0094, \u00c2\u0093comfort\u00c2\u0094, \u00c2\u0093simplicity\u00c2\u0094 and \u00c2\u0093sustainability\u00c2\u0094. The model chosen for analysis is the most frequently ordered one (Reply Air, reference 466 160 MT) from the Reply range.",
      "Carbon intensity":5.71,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Share It is a modular storage system. It offers personal storage, team storage, meeting point solutions and lockers.  Share It can be also used as space dividers, structuring workspaces. - It is modular and offers endless planning possibilities. - The range enhances collaboration providing communication platforms. - It helps people concentrate thanks to acoustics absorbing surfaces. - It offers wide range of finishes for different workplace ambiances.",
      "description":"Share It is a modular storage system. It offers personal storage, team storage, meeting point solutions and lockers.  Share It can be also used as space dividers, structuring workspaces. - It is modular and offers endless planning possibilities. - The range enhances collaboration providing communication platforms. - It helps people concentrate thanks to acoustics absorbing surfaces. - It offers wide range of finishes for different workplace ambiances.",
      "Carbon intensity":2.12,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Share It modular storage system",
      "description":"Share It is a modular storage system. It offers personal storage, team storage, meeting point solutions and lockers.  Share It can be also used as space dividers, structuring workspaces. - It is modular and offers endless planning possibilities. - The range enhances collaboration providing communication platforms. - It helps people concentrate thanks to acoustics absorbing surfaces. - It offers wide range of finishes for different workplace ambiances.",
      "Carbon intensity":2.12,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Tenaro (European supply chain)",
      "description":"Tenaro Typ 10 is a range of desk simple to configure and adjust according to customized requirements.The model chosen for analysis is the most popular model Tenaro Typ 10 (reference 5412700).",
      "Carbon intensity":0.78,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"TNT* (European supply chain)",
      "description":"Make your workplace a dynamic workspace. TNT* is a new kind of dynamic workspace solution with a wide range of options for all kinds of users and work  styles. Thanks to its flexible architecture, TNT* allows you to expand, upgrade or adapt any configuration to the changing needs of users and teams.The model chosen for analysis is the most popular model (reference 880 000 150).",
      "Carbon intensity":1.05,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Universal Storage EU (European supply chain)",
      "description":"The Universal Storage is a large and flexible storage range that can adapt to all environments and that live up to all criteria of aesthetics and security. It is the new generation of the Universal Storage range launched in 1995. The cupboard - side opening tambour doors (reference 845 030 220) is the most sold model from the Universal Storage range.",
      "Carbon intensity":1.49,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Westside (European supply chain)",
      "description":"The Westside chair is made with a single shell, with just the right shape, angle and flexibility to provide maximum comfort for the back. The Westside chair is engineered for demanding spaces like informal office areas, cafeterias and hotels where traditional seating falls short. The model chosen for analysis is the Westside chair reference 11 LUG 30.",
      "Carbon intensity":3.72,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"The model chosen for analysis is the most popular model Think work chair.  It is a highly adjustable ergonomic chair equipped as follows: 1. Your PowerTM weight activated mechanism 2. Your ProfileTM seat and back flexors  3. Your PreferenceTM control  4. Adjustable seat depth 5. Adjustable seat height 6. Adjustable lumbar support 7. Adjustable armrests 8. Plastic base",
      "description":"The model chosen for analysis is the most popular model Think work chair.  It is a highly adjustable ergonomic chair equipped as follows: 1. Your PowerTM weight activated mechanism 2. Your ProfileTM seat and back flexors  3. Your PreferenceTM control  4. Adjustable seat depth 5. Adjustable seat height 6. Adjustable lumbar support 7. Adjustable armrests 8. Plastic base",
      "Carbon intensity":4.96,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Think work chair",
      "description":"The model chosen for analysis is the most popular model Think work chair.  It is a highly adjustable ergonomic chair equipped as follows: 1. Your Power(TM) weight activated mechanism 2. Your Profile(TM) seat and back flexors  3. Your Preference(TM) control  4. Adjustable seat depth 5. Adjustable seat height 6. Adjustable lumbar support 7. Adjustable armrests 8. Plastic base",
      "Carbon intensity":4.96,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"32 Seconds (European supply chain)",
      "description":"32 Seconds is a universal family of seating that helps build a creative and capable workspace \u00c2\u0096 and ultimately a more successful organisation \u00c2\u0096 by fulfilling your people\u00c2\u0092s ergonomic requirements and personal preferences. 32 Seconds will seat all of your people in complete comfort \u00c2\u0096 regardless of physique, age, gender or personal taste \u00c2\u0096 and adapt itself to any kind of workstyle. What\u00c2\u0092s more it\u00c2\u0092s so easy to assemble that you\u00c2\u0092ll be using it within32 seconds of opening the box! The model chosen for analysis is the most frequently ordered task chair (model 4558TRA) from the 32 Seconds seating range.",
      "Carbon intensity":4.6,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Activa (European supply chain)",
      "description":"The Activa desks are highly ergonomic and offer different height adjustable versions in a single design. Its modular construction allows very easy assembly and reconfiguration. The model chosen for analysis is the most frequently ordered one (reference W6412700) from the Activa Telescopic range. Standard features on this model include: - Top dimensions: 1600 mm x 800 mm - Melamine top, Snow WY - Steel leg and frame, Pearl Snow ZW - Telescopic height adjustment from 620 mm to 900 mm - Steel cable tray.",
      "Carbon intensity":3.58,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Amia (European supply chain)",
      "description":"The enveloping backrest and the textured, refined look of Amia are immediately inviting. And as soon as you sit down in this robust yet comfortable chair, you know you've found something special. Both the LiveLumbar\u00c2\u0099 support and the flexible seat edge angle adjust automatically to your body shape. The model chosen for analysis is the most frequently ordered task chair (model 482 200 MP) from the Amia seating range.",
      "Carbon intensity":8.55,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"B-Free big cube (European supply chain)",
      "description":"B-Free range welcomes varied work postures - reading, reclining, or leaning in to a conversation. B-Free big cube Different shapes and sizes to follow the movements of the user whether connecting, collaborating or concentrating and to offer qualitative support in a wide variety of postures. The model chosen for analysis is the most representative one (reference N3L T00 460) from the B-Free range.",
      "Carbon intensity":3.16,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"B-Free Desk (European supply chain)",
      "description":"B-Free Desk offers the right balance between functionality and beauty. It creates a natural and cozy atmosphere in the office, ideal to foster creativity, concentration and/or collaboration of workers. The multiple features of the desk allow users to benefit from a fully functional workstation. The model chosen for analysis is the most representative line (reference # N311012700) from the B-Free desk range.",
      "Carbon intensity":2.38,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Fungicide",
      "description":"Crop protection product",
      "Carbon intensity":2.8,
      "industry":"Chemicals"
  },
  {
      "name":"Herbicide",
      "description":"Crop protection product",
      "Carbon intensity":3.72,
      "industry":"Chemicals"
  },
  {
      "name":"Insecticide",
      "description":"Crop protection product",
      "Carbon intensity":4.82,
      "industry":"Chemicals"
  },
  {
      "name":"Seed treatment",
      "description":"Crop protection product",
      "Carbon intensity":1.02,
      "industry":"Chemicals"
  },
  {
      "name":"Soda Ash for Unilever plc",
      "description":"Field not included in 2013 data",
      "Carbon intensity":1.28,
      "industry":"Chemicals"
  },
  {
      "name":"Soda Ash",
      "description":"Soda Ash for Unilever plc",
      "Carbon intensity":1.06,
      "industry":"Chemicals"
  },
  {
      "name":"Soda Ash",
      "description":"Soda Ash for Unilever plc",
      "Carbon intensity":1.01,
      "industry":"Chemicals"
  },
  {
      "name":"Soda Ash",
      "description":"Soda Ash for Unilever plcFinal product from our end which customers uses as Final \/ Intermediate product",
      "Carbon intensity":0.87,
      "industry":"Chemicals"
  },
  {
      "name":"Soda Ash for Wal-Mart Stores, Inc.",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.7,
      "industry":"Chemicals"
  },
  {
      "name":"Soda Ash from Tata Chemicals Europe",
      "description":"BLANK",
      "Carbon intensity":0.84,
      "industry":"Chemicals"
  },
  {
      "name":"Soda Ash (Tata Chemicals Europe)",
      "description":"BLANK",
      "Carbon intensity":0.76,
      "industry":"Chemicals"
  },
  {
      "name":"Soda Ash (Tata Chemicals Magadi)",
      "description":"BLANK",
      "Carbon intensity":0.5,
      "industry":"Chemicals"
  },
  {
      "name":"Soda Ash (Tata Chemicals North America)",
      "description":"BLANK",
      "Carbon intensity":0.7,
      "industry":"Chemicals"
  },
  {
      "name":"Soda Ash (Tata Chemicals Mithapur, India)",
      "description":"BLANK",
      "Carbon intensity":1.08,
      "industry":"Chemicals"
  },
  {
      "name":"Hot Rolled Steel",
      "description":"hot rolled product",
      "Carbon intensity":2.43,
      "industry":"Metals & Mining"
  },
  {
      "name":"Hot Rolled Steel (HR)",
      "description":"Hot rolled product",
      "Carbon intensity":2.62,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Cold Rolled Steel",
      "description":"cold rolled product",
      "Carbon intensity":2.55,
      "industry":"Metals & Mining"
  },
  {
      "name":"Cold Rolled Steel (CR)",
      "description":"Cold rolled product",
      "Carbon intensity":2.75,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Galvanised Steel",
      "description":"cold rolled product (galvanised)",
      "Carbon intensity":2.61,
      "industry":"Metals & Mining"
  },
  {
      "name":"Galvanized Steel (Galv)",
      "description":"Cold rolled product with coating (galvanized)",
      "Carbon intensity":2.82,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Slim 200ml",
      "description":"Field not included in 2013 data",
      "Carbon intensity":1.89,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Slim 200ml",
      "description":"Carton package for long-life liquid beverages",
      "Carbon intensity":1.89,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Slim 200ml",
      "description":"Carton package for long-life liquid beverages",
      "Carbon intensity":1.89,
      "industry":"Packaging for consumer goods"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Slim 200ml",
      "description":"Carton package for long-life liquid beverages",
      "Carbon intensity":1.78,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Slim 250ml",
      "description":"Field not included in 2013 data",
      "Carbon intensity":1.8,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Slim 250ml",
      "description":"Carton package for long-life liquid beverages",
      "Carbon intensity":1.8,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Slim 250ml",
      "description":"Carton package for long-life liquid beverages",
      "Carbon intensity":1.8,
      "industry":"Packaging for consumer goods"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Slim 250ml",
      "description":"Carton package for long-life liquid beverages",
      "Carbon intensity":1.8,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Base 250ml",
      "description":"Field not included in 2013 data",
      "Carbon intensity":1.8,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Base 250ml",
      "description":"Carton package for long-life liquid beverages",
      "Carbon intensity":1.8,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Base 250ml",
      "description":"Carton package for long-life liquid beverages",
      "Carbon intensity":1.8,
      "industry":"Packaging for consumer goods"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Base 250ml",
      "description":"Carton package for long-life liquid beverages",
      "Carbon intensity":1.7,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Base 1000ml",
      "description":"Field not included in 2013 data",
      "Carbon intensity":1.64,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Base 1000ml",
      "description":"Carton package for long-life liquid beverages",
      "Carbon intensity":1.64,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Base 1000ml",
      "description":"Carton package for long-life liquid beverages",
      "Carbon intensity":1.64,
      "industry":"Packaging for consumer goods"
  },
  {
      "name":"Tetra Brik\u00c2\u00ae Aseptic Base 1000ml",
      "description":"Carton package for long-life liquid beverages",
      "Carbon intensity":1.5,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Bloomberg's standard-issue flat panel configuration (prior to 2010) was two 19\" panels mounted on a metal stand. In early 2010 Bloomberg engaged in the WRI Product Life Cycle Roadtest for this functional unit (cradle-to-grave). The functional unit has a lifespan of 5 years, so the emissions indicated [in this report] are the full emissions associated with that lifespan.",
      "description":"Bloomberg's standard-issue \"flat panel unit\" configuration, which was (up through 2012) two 19\" panels mounted on a metal stand. The functional unit had a lifespan of 5 years, so the emissions indicated to the right are the full emissions associated with that lifespan.",
      "Carbon intensity":646.44,
      "industry":"Media"
  },
  {
      "name":"Bloomberg-Provided Flat Panel Unit",
      "description":"Bloomberg's standard-issue \"flat panel unit\" configuration, which was (up through 2012) two 19\" panels mounted on a metal stand. The functional unit had a lifespan of 5 years, so the emissions indicated [in this report] are the full emissions associated with that lifespan.",
      "Carbon intensity":646.44,
      "industry":"Media"
  },
  {
      "name":"Bloomberg-Provided Flat Panel Unit",
      "description":"Bloomberg's standard-issue \"flat panel unit\" configuration, which is currently two 23\" panels mounted on a metal stand. The functional unit has a lifespan of 4 years, so the emissions indicated [in this report] are the full emissions associated with that lifespan.",
      "Carbon intensity":120.96,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Bloomberg-Provided Flat Panel Unit",
      "description":"Bloomberg's standard-issue \"flat panel unit\" configuration, which is currently two 23\" panels mounted on a metal stand. The functional unit has a lifespan of 4 years, so the emissions indicated [in this report] are the full emissions associated with that lifespan.",
      "Carbon intensity":120.96,
      "industry":"Media"
  },
  {
      "name":"Bloomberg's standard keyboard which is optional hardware available for lease to all Bloomberg Terminal customers.  The functional unit has a lifespan of 3 years, so the emissions indicated [in this report] are the full emissions associated with that lifespan.",
      "description":"Bloomberg's standard keyboard which is optional hardware available for lease to all Bloomberg Terminal customers.  The functional unit has a lifespan of 3 years, so the emissions indicated to the right are the full emissions associated with that lifespan.",
      "Carbon intensity":86.74,
      "industry":"Media"
  },
  {
      "name":"Bloomberg-Provided Keyboard",
      "description":"Bloomberg's standard keyboard which is optional hardware available for lease to all Bloomberg Terminal customers.  The functional unit has a lifespan of 3 years, so the emissions indicated [in this report] are the full emissions associated with that lifespan.",
      "Carbon intensity":86.74,
      "industry":"Media"
  },
  {
      "name":"Bloomberg-Provided Keyboard",
      "description":"Bloomberg's standard keyboard which is optional hardware available for lease to all Bloomberg Terminal customers.  The functional unit has a lifespan of 5 years, so the emissions indicated [in this report] are the full emissions associated with that lifespan.",
      "Carbon intensity":37.04,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Bloomberg-Provided Keyboard",
      "description":"Bloomberg's standard keyboard which is optional hardware available for lease to all Bloomberg Terminal customers.  The functional unit has a lifespan of 5 years, so the emissions indicated [in this report] are the full emissions associated with that lifespan.",
      "Carbon intensity":37.04,
      "industry":"Media"
  },
  {
      "name":"Bloomberg's biometric device (B-Unit) distributed to all Bloomberg Terminal customers.  The functional unit has a lifespan of 3 years, so the emissions indicated [in this report] are the full emissions associated with that lifespan.",
      "description":"Bloomberg's biometric device (B-Unit) distributed to all Bloomberg Terminal customers.  The functional unit has a lifespan of 3 years, so the emissions indicated to the right are the full emissions associated with that lifespan.",
      "Carbon intensity":75.17,
      "industry":"Media"
  },
  {
      "name":"Bloomberg B-Unit",
      "description":"Bloomberg's biometric device (B-Unit) distributed to all Bloomberg Terminal customers.  The functional unit has a lifespan of 3 years, so the emissions indicated [in this report] are the full emissions associated with that lifespan.",
      "Carbon intensity":75.17,
      "industry":"Media"
  },
  {
      "name":"Bloomberg B-Unit",
      "description":"Bloomberg's biometric device (B-Unit) distributed to all Bloomberg Terminal customers.  The functional unit has a lifespan of 3 years, so the emissions indicated [in this report] are the full emissions associated with that lifespan.",
      "Carbon intensity":68.97,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Bloomberg B-Unit",
      "description":"Bloomberg's biometric device (B-Unit) distributed to all Bloomberg Terminal customers.  The functional unit has a lifespan of 3 years, so the emissions indicated [in this report] are the full emissions associated with that lifespan.",
      "Carbon intensity":68.97,
      "industry":"Media"
  },
  {
      "name":"TG582n Home Gateway to provide multiple play telecom data services (data, voice, TV) in the home.",
      "description":"TG582n Home Gateway to provide multiple play telecom data services (data, voice, TV) in the home.",
      "Carbon intensity":185.31,
      "industry":"Media"
  },
  {
      "name":"Home Gateway TG582n",
      "description":"Home Gateway providing multiple play telecom data services (data, voice, TV) in the home",
      "Carbon intensity":185.31,
      "industry":"Media"
  },
  {
      "name":"Home Gateway TG582n",
      "description":"Home Gateway providing multiple play telecom data services (data, voice,TV) in the home",
      "Carbon intensity":185.31,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"GL film packages",
      "description":"GL films are the transparent barrier films for package. These films are used as a barrier layer in a laminated film instead of an aluminum foil. The laminated film is supplied by the roll.",
      "Carbon intensity":28.1,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"MR-PET film package",
      "description":"MR-PET film is a film consisted of mechanically recycled PET resin. This film is used as a layer in a laminated film. The laminated film is supplied by the roll.",
      "Carbon intensity":27.01,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Agricultural tires, BlueTire Yechnology",
      "description":"By analyzing the impact of the agricultural tire (LCA - Life Cycle Assessment methodology), Trelleborg is able to significantly reduce the lifetime carbon footprint on its tires, from the initial design phase through to their recycling. For the BlueTire Technology launched by Trelleborg, 1 kg of product generates CO2 equivalent emissions of around 3.8 kg. Trelleborg has measured a 6% reduction of the carbon footprint related to the working life of a Trelleborg BlueTire Technology compared to standard technology tires. Total emissions: 1408.62 kg CO2 (3.8 kg CO2 per unit * 370.69 kg, weight of 1329200 - 710\/70R42TL TM1000HP - BlueTire)",
      "Carbon intensity":3.8,
      "industry":"Electrical Equipment"
  },
  {
      "name":"Polyethylene pipe",
      "description":"Field not included in 2013 data",
      "Carbon intensity":2.52,
      "industry":"Building Products"
  },
  {
      "name":"VW Polo V 1.6 TDI BlueMotion Technology",
      "description":"Field not included in 2013 data",
      "Carbon intensity":21.88,
      "industry":"Automobiles"
  },
  {
      "name":"VW Polo",
      "description":"vehicle representing models the small segment (Polo 1.6 TDI [66 kW] BlueMotion Technology)",
      "Carbon intensity":21.88,
      "industry":"Automobiles"
  },
  {
      "name":"Volkswagen Polo",
      "description":"vehicle representing models of the small segment (Polo 1.6 TDI, 66kW, BlueMotion Technologies)",
      "Carbon intensity":21.88,
      "industry":"Automobiles & components"
  },
  {
      "name":"Volkswagen Polo",
      "description":"vehicle representing models of the small segment (Polo 1.6 TDI, 66kW, BlueMotion Technologies)",
      "Carbon intensity":21.88,
      "industry":"Auto Components"
  },
  {
      "name":"VW Golf VII 1.6 TDI BlueMotion Technology",
      "description":"Field not included in 2013 data",
      "Carbon intensity":16.36,
      "industry":"Automobiles"
  },
  {
      "name":"VW Golf",
      "description":"vehicle representing models in the compact segment (Golf 1.6 TDI [77kW] BlueMotion Technology)",
      "Carbon intensity":15.93,
      "industry":"Automobiles"
  },
  {
      "name":"Volkswagen Golf",
      "description":"vehicle representing models of the compact segment (Golf 1.6 TDI, 77 kW, BlueMotion Technologies)",
      "Carbon intensity":15.93,
      "industry":"Automobiles & components"
  },
  {
      "name":"Volkswagen Golf",
      "description":"vehicle representing models of the compact segment (Golf 1.6 TDI, 77 kW, BlueMotion Technologies)",
      "Carbon intensity":16.36,
      "industry":"Auto Components"
  },
  {
      "name":"Passat B7 2.0 TDI BlueMotion Technology",
      "description":"Field not included in 2013 data",
      "Carbon intensity":18.2,
      "industry":"Automobiles"
  },
  {
      "name":"VW Passat",
      "description":"vehicle representing models in the midsize segment (Passat 2.0 TDI [103 kW] BlueMotion Technology)",
      "Carbon intensity":18.2,
      "industry":"Automobiles"
  },
  {
      "name":"Volkswagen Passat",
      "description":"vehicle representing models of the midsize segment (Passat 2.0 TDI, 103 kW, BlueMotion Technologies)",
      "Carbon intensity":18.2,
      "industry":"Automobiles & components"
  },
  {
      "name":"Volkswagen Passat",
      "description":"vehicle representing models of the midsize segment (Passat 2.0 TDI, 103 kW, BlueMotion Technologies)",
      "Carbon intensity":18.2,
      "industry":"Auto Components"
  },
  {
      "name":"Audi A3 2.0 TDI",
      "description":"Field not included in 2013 data",
      "Carbon intensity":20.99,
      "industry":"Automobiles"
  },
  {
      "name":"Mean value for a vehicle within the Volkswagen Group according to CDP Report 2013 (global scope)",
      "description":"BLANK",
      "Carbon intensity":22.54,
      "industry":"Automobiles"
  },
  {
      "name":"Mean value for a vehicle within the Volkswagen Group according to CDP Report 2014 (global scope)",
      "description":"BLANK",
      "Carbon intensity":21.89,
      "industry":"Automobiles & components"
  },
  {
      "name":"VW up!",
      "description":"vehicle representing models the very small segment (up! 1.0 MPI [44kW] BlueMotion Technology)",
      "Carbon intensity":23.11,
      "industry":"Automobiles"
  },
  {
      "name":"Volkswagen up!",
      "description":"vehicle representing models of the very small segment (up! 1.0 MPI, 44 kW, BlueMotion Technologies)",
      "Carbon intensity":23.11,
      "industry":"Automobiles & components"
  },
  {
      "name":"Volkswagen up!",
      "description":"Vehicle representing models of the very small segment (up! 1.0 MPI \/44KW BlueMotion Technologies)",
      "Carbon intensity":23.11,
      "industry":"Auto Components"
  },
  {
      "name":"Audi A6",
      "description":"vehicle representing models in the fullsize segment (A6 3.0 TDI [180 kW])",
      "Carbon intensity":19.57,
      "industry":"Automobiles"
  },
  {
      "name":"Audi A6",
      "description":"vehicle representing models of the fullsize segment (A6, 3.0 TDI, 180 kW)",
      "Carbon intensity":19.57,
      "industry":"Automobiles & components"
  },
  {
      "name":"Audi A6",
      "description":"vehicle representing models of the fullsize segment (A6, 3.0 TDI, 180 kW)",
      "Carbon intensity":19.57,
      "industry":"Auto Components"
  },
  {
      "name":"VW Caddy",
      "description":"vehicle representing models in the commercial vehicle segment (Caddy 1.6 TDI [75 kW] BlueMotion Technology)",
      "Carbon intensity":25.36,
      "industry":"Automobiles"
  },
  {
      "name":"Volkswagen Caddy",
      "description":"vehicle representing models of the commercial vehicle segment (Caddy 1.6 TDI, 75 kW, BlueMOtion Technologies)",
      "Carbon intensity":25.36,
      "industry":"Automobiles & components"
  },
  {
      "name":"Volkswagen Caddy",
      "description":"vehicle representing models of the commercial vehicle segment (Caddy 1.6 TDI, 75 kW, BlueMotion Technologies)",
      "Carbon intensity":25.36,
      "industry":"Auto Components"
  },
  {
      "name":"Volkswagen e-up",
      "description":"electrified vehicle of the very small segment (calculation is based on using BluePower (clean electricity); 0 g\/km CO2 driving emissions by electric mobiliy)",
      "Carbon intensity":6.37,
      "industry":"Auto Components"
  },
  {
      "name":"Alliance HPLC (High Peformance Liquid Chromatography)  The Alliance is an HPLC that is unique in that it has a single set of electronic boards that control the functions for both the solvent delivery system and the autosampler in the liquid chromatograph.",
      "description":"Alliance HPLC (High Peformance Liquid Chromatography)  The Alliance is an HPLC that is unique in that it has a single set of electronic boards that control the functions for both the solvent delivery system and the autosampler in the liquid chromatograph.",
      "Carbon intensity":257.57,
      "industry":"Life Sciences Tools & Services"
  },
  {
      "name":"Alliance (HPLC)",
      "description":"Separation technique low efficiency.",
      "Carbon intensity":681.61,
      "industry":"Life Sciences Tools & Services"
  },
  {
      "name":"ACQUITY\u00c2\u00ae UPLC, ACQUITY\u00c2\u00ae I-Class, ACQUITY\u00c2\u00ae H-Class",
      "description":"Field not included in 2013 data",
      "Carbon intensity":659.24,
      "industry":"Life Sciences Tools & Services"
  },
  {
      "name":"Electric Motor",
      "description":"Electric Motor with highest class efficiency and motors with class efficiency superior to the regulation",
      "Carbon intensity":589.53,
      "industry":"Machinery"
  },
  {
      "name":"Electric Motor",
      "description":"Electric Motor with highest class efficiency and motors with class efficiency superior to the regulation",
      "Carbon intensity":973.22,
      "industry":"Machinery"
  },
  {
      "name":"Electric Motor",
      "description":"Electric Motor with highest class efficiency and motors with class efficiency superior to the regulation",
      "Carbon intensity":222.31,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"Phaser 6600",
      "description":"Field not included in 2013 data",
      "Carbon intensity":22.9,
      "industry":"Office Electronics"
  },
  {
      "name":"Phaser 6600",
      "description":"Printing device",
      "Carbon intensity":22.9,
      "industry":"Office Electronics"
  },
  {
      "name":"Phaser 6600",
      "description":"Printing device",
      "Carbon intensity":22.9,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Phaser 6600",
      "description":"Printing device",
      "Carbon intensity":22.9,
      "industry":"Software"
  },
  {
      "name":"ColorQube 8900",
      "description":"Field not included in 2013 data",
      "Carbon intensity":52.8,
      "industry":"Office Electronics"
  },
  {
      "name":"ColorQube 8900",
      "description":"Printing device",
      "Carbon intensity":52.8,
      "industry":"Office Electronics"
  },
  {
      "name":"ColorQube 8900",
      "description":"Printing device",
      "Carbon intensity":52.8,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"ColorQube 8900",
      "description":"Printing device",
      "Carbon intensity":52.8,
      "industry":"Software"
  },
  {
      "name":"ColorQube 9200",
      "description":"Field not included in 2013 data",
      "Carbon intensity":19.22,
      "industry":"Office Electronics"
  },
  {
      "name":"ColorQube 9200",
      "description":"Printing device",
      "Carbon intensity":19.22,
      "industry":"Office Electronics"
  },
  {
      "name":"ColorQube 9200",
      "description":"Printing device",
      "Carbon intensity":19.22,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"ColorQube 9200",
      "description":"Printing device",
      "Carbon intensity":19.22,
      "industry":"Software"
  },
  {
      "name":"ColorQube 8870",
      "description":"Field not included in 2013 data",
      "Carbon intensity":62.02,
      "industry":"Office Electronics"
  },
  {
      "name":"ColorQube 8870",
      "description":"Printing device",
      "Carbon intensity":59.11,
      "industry":"Office Electronics"
  },
  {
      "name":"ColorQube 8870",
      "description":"Printing device",
      "Carbon intensity":59.11,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"ColorQube 8870",
      "description":"Printing device",
      "Carbon intensity":59.11,
      "industry":"Software"
  },
  {
      "name":"Phaser 7100",
      "description":"Printing device",
      "Carbon intensity":45.45,
      "industry":"Office Electronics"
  },
  {
      "name":"Phaser 7100",
      "description":"Printing device",
      "Carbon intensity":45.45,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Phaser 7100",
      "description":"Printing device",
      "Carbon intensity":45.45,
      "industry":"Software"
  },
  {
      "name":"WorkCentre 5945\/5955",
      "description":"Multifunctional Printing Device",
      "Carbon intensity":26.6,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"WorkCentre 5945\/5955",
      "description":"Multifunctional Printing Device",
      "Carbon intensity":26.6,
      "industry":"Software"
  },
  {
      "name":"WorkCentre 5325",
      "description":"Multifunctional Print Device STD",
      "Carbon intensity":9.48,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"WorkCentre 5325",
      "description":"Multifunctional Print Device STD",
      "Carbon intensity":9.48,
      "industry":"Software"
  },
  {
      "name":"WorkCentre 5330",
      "description":"Multifunctional Print Device STD",
      "Carbon intensity":10.93,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"WorkCentre 5330",
      "description":"Multifunctional Print Device STD",
      "Carbon intensity":10.93,
      "industry":"Software"
  },
  {
      "name":"WorkCentre 5335",
      "description":"Multifunctional Print Device STD",
      "Carbon intensity":12.39,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"WorkCentre 5335",
      "description":"Multifunctional Print Device STD",
      "Carbon intensity":12.39,
      "industry":"Software"
  },
  {
      "name":"Pressure transmitter (?????) GTX",
      "description":"???????????????????????????????????????????????????????????????????????????????4?20mADC????????????????????????  http:\/\/www.azbil.com\/jp\/product\/iap\/fi\/fi_gtx.html",
      "Carbon intensity":11.72,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Photoelectric sensor (??????)",
      "description":"???????????????????????????????????????????????????????????????????????????????????????????????  http:\/\/www.compoclub.com\/products\/list\/switch\/detail\/HP7.html",
      "Carbon intensity":125.45,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Neosensor indoor temperature sensor (????? ????????)",
      "description":"?????????? ?????????????Pt1000????????????????????? ???????????????????????????????????????????????  http:\/\/www.azbil.com\/jp\/product\/ba\/bas\/sensor_nsensor.html",
      "Carbon intensity":22.73,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Temperature sensor for duct (?????????)",
      "description":"????????????????????????????????? ???????????????????????????????????????????????????????????????  http:\/\/www.azbil.com\/jp\/product\/ba\/bas\/sensor_sounyu.html\"",
      "Carbon intensity":34.58,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"1 fuel-efficient tire for passenger cars (??????????)",
      "description":"??????????????? Life Cycle GHG emission",
      "Carbon intensity":29.48,
      "industry":"Auto Components"
  },
  {
      "name":"1 fuel-efficient tire for passenger cars (??????????)",
      "description":"Low fuel consumption grade A, AA, the tire of the AAA class developed in accordance with the vehicle performance, it has delivered. (???????A?AA?AAA?????????????????????????????)",
      "Carbon intensity":33.07,
      "industry":"Automobiles & components"
  },
  {
      "name":"1 fuel-efficient truck and buss tire???????????????????",
      "description":"??????????????? Life Cycle GHG emission",
      "Carbon intensity":11.76,
      "industry":"Auto Components"
  },
  {
      "name":"1 fuel-efficient truck and buss tire???????????????????",
      "description":"???????????????????????????????????????????????????",
      "Carbon intensity":10.84,
      "industry":"Automobiles & components"
  },
  {
      "name":"CHEP wooden exchange (pooled) pallet in USA 48x40",
      "description":"Functional unit defined as: One pallet used to transport and deliver goods from a manufacturer to a distributor in the North American supply chain. 48x40 wooden pallet. Includes weight of product being shipped on pallet.",
      "Carbon intensity":1.28,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"CHEP wooden exchange (pooled) pallet in Canada 48x40",
      "description":"Functional unit defined as: One pallet used to transport and deliver goods from a manufacturer to a distributor in the North American supply chain. 48x40 wooden pallet. Includes weight of product being shipped on pallet.",
      "Carbon intensity":1.11,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"Foldable reusable plastic crates (RPCs) in Australia",
      "description":"A comparative Life Cycle Assessment of Returnable Plastic Crates (RPC) versus a disposable cardboard carton for fresh produce distribution. Returnable plastic crate that folds flat (foldable RPC). 1000 litres of produce moved from the producer to the retail store\u00c2\u0092s inbound goods loading bay in a packaging unit that meets the Australian Retailers Specified Hygiene Standard for food transportation.",
      "Carbon intensity":8.02,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"CHEP wooden exchange (pooled) pallet in Canada 48x20",
      "description":"Functional unit defined as: One pallet used to transport and deliver goods from a manufacturer to a distributor in the North American supply chain. 48x20 wooden pallet. Includes weight of product being shipped on pallet.",
      "Carbon intensity":1.18,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"IFCO reusable plastic crates (RPCs) in North America",
      "description":"IFCO manufactures, converts, and delivers the produce containers to growers as well as managing the rental pool for collection, hygienic cleaning, reuse, and recycling of the RPCs. These containers are a rigid polypropylene container designed for multiple-uses: 1) they are display-ready and usable for chilled and humidified storage and display conditions; 2) they have an open side and base structure that can be quickly assembled for use and folded for storage\/cleaning; and 3) the insides have rounded inner edges. IFCO RPCs are made in different standard sizes covering a range of fruit and vegetable produce applications. IFCO\u00c2\u0092s RPC types are mutually compatible (i.e., in terms of stacking properties) for segregated and mixed dispatch units and suited to the use of jawed loaders as well as materials handling technology and automatic storage systems. Definition of functional unit: products are compared on the basis of providing the same defined function or unit of service which is called the functional unit. The function of produce containers is to transport fresh produce from growers to retail locations. In the case of the RPCs and DRCs, the containers can also be used to display the produce at retail stores. The functional unit of this LCA is based on an equivalent quantity of produce delivered to stores: 1,000 tonnes of produce delivered to retail stores in North America (US or Canada).",
      "Carbon intensity":37.22,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"Rigid side reusable plastic crates (RPCs) in Australia",
      "description":"A comparative Life Cycle Assessment of Returnable Plastic Crates (RPC) versus a disposable cardboard carton for fresh produce distribution. 1000 litres of produce moved from the producer to the retail store\u00c2\u0092s inbound goods loading bay in a packaging unit that meets the Australian Retailers Specified Hygiene Standard for food transportation.",
      "Carbon intensity":14.19,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"The Polyethylene (PE), molecular formula (CH2)n, is currently the world's main plastic material. Its properties depend on the shape of the polyethylene \u00c2\u0097 given that the ones of low density are more flexible while the high density polyethylenes are more rigid. This material is produced from the polymerization of the monomer ethylene. Despite the differences between the types of polyethylene produced by Braskem, this assessment was targeted at finding an average value of emissions for all of the resins produced. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "description":"The Polyethylene (PE), molecular formula (CH2)n, is currently the world's main plastic material. Its properties depend on the shape of the polyethylene \u00c2\u0097 given that the ones of low density are more flexible while the high density polyethylenes are more rigid. This material is produced from the polymerization of the monomer ethylene. Despite the differences between the types of polyethylene produced by Braskem, this assessment was targeted at finding an average value of emissions for all of the resins produced. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "Carbon intensity":1.32,
      "industry":"Chemicals"
  },
  {
      "name":"Polyethylene",
      "description":"The Polyethylene (PE), molecular formula (CH2)n, is currently the world's main plastic material. Its properties depend on the shape of the polyethylene \u00c2\u0097 given that the ones of low density are more flexible while the high density polyethylenes are more rigid. This material is produced from the polymerization of the monomer ethylene. Despite the differences between the types of polyethylene produced by Braskem, this assessment was targeted at finding an average value of emissions for all of the resins produced. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "Carbon intensity":1.32,
      "industry":"Chemicals"
  },
  {
      "name":"Polyethylene",
      "description":"The Polyethylene (PE), molecular formula (CH2)n, is currently the world's main plastic material. Its properties depend on the shape of the polyethylene \u00c2\u0097 given that the ones of low density are more flexible while the high density polyethylenes are more rigid. This material is produced from the polymerization of the monomer ethylene. Despite the differences between the types of polyethylene produced by Braskem, this assessment was targeted at finding an average value of emissions for all of the resins produced. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "Carbon intensity":1.32,
      "industry":"Chemicals"
  },
  {
      "name":"Polyethylene",
      "description":"The Polyethylene (PE), molecular formula (CH2)n, is currently the world's main plastic material. Its properties depend on the shape of the polyethylene \u00c2\u0097 given that the ones of low density are more flexible while the high density polyethylenes are more rigid. This material is produced from the polymerization of the monomer ethylene. Despite the differences between the types of polyethylene produced by Braskem, this assessment was targeted at finding an average value of emissions for all of the resins produced. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "Carbon intensity":1.32,
      "industry":"Chemicals"
  },
  {
      "name":"Polypropylene (PP) or Polypropene, which has the molecular formula of (CH (CH3) - CH2)n is a resin produced from the polymerization of monomer Propene, its main feedstock. It may also be produced from a mixture of two types of monomers (ethylene and propylene), producing the PP Copolymer. This is the carbon footprint for the Polypropylene produced in Brazil. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "description":"Polypropylene (PP) or Polypropene, which has the molecular formula of (CH (CH3) - CH2)n is a resin produced from the polymerization of monomer Propene, its main feedstock. It may also be produced from a mixture of two types of monomers (ethylene and propylene), producing the PP Copolymer. This is the carbon footprint for the Polypropylene produced in Brazil. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "Carbon intensity":1.33,
      "industry":"Chemicals"
  },
  {
      "name":"Polypropylene",
      "description":"Polypropylene (PP) or Polypropene, which has the molecular formula of (CH (CH3) - CH2)n is a resin produced from the polymerization of monomer Propene, its main feedstock. It may also be produced from a mixture of two types of monomers (ethylene and propylene), producing the PP Copolymer. This is the carbon footprint for the Polypropylene produced in Brazil. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "Carbon intensity":1.33,
      "industry":"Chemicals"
  },
  {
      "name":"Polypropylene",
      "description":"Polypropylene (PP) or Polypropene, which has the molecular formula of (CH (CH3) - CH2)n is a resin produced from the polymerization of monomer Propene, its main feedstock. It may also be produced from a mixture of two types of monomers (ethylene and propylene), producing the PP Copolymer. This is the carbon footprint for the Polypropylene produced in Brazil. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "Carbon intensity":1.33,
      "industry":"Chemicals"
  },
  {
      "name":"Polypropylene",
      "description":"Polypropylene (PP), which has the molecular formula of (CH (CH3) - CH2)n is a resin produced from the polymerization of monomer Propene, its main feedstock. It may also be produced from a mixture of two types of monomers (ethylene and propylene), producing the PP Copolymer. This is the carbon footprint for the Polypropylene produced in Brazil. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "Carbon intensity":1.33,
      "industry":"Chemicals"
  },
  {
      "name":"The Polyvinyl Chloride (PVC; -(CH2-CHCl)n-) is the oldest plastic material. This material is produced from the polymerization of the monomer MVC. Braskem has a chlorine production unit, base material, which shall be used for the production of DCE (1,2-dichloroethane) from the mixture of chloride and ethylene. Afterwards, the DCE reacts to form MVC, the monomer for the polymerization process. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "description":"The Polyvinyl Chloride (PVC; -(CH2-CHCl)n-) is the oldest plastic material. This material is produced from the polymerization of the monomer MVC. Braskem has a chlorine production unit, base material, which shall be used for the production of DCE (1,2-dichloroethane) from the mixture of chloride and ethylene. Afterwards, the DCE reacts to form MVC, the monomer for the polymerization process. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "Carbon intensity":1.77,
      "industry":"Chemicals"
  },
  {
      "name":"Polyvinyl Chloride",
      "description":"The Polyvinyl Chloride (PVC; -(CH2-CHCl)n-) is the oldest plastic material. This material is produced from the polymerization of the monomer MVC. Braskem has a chlorine production unit, base material, which shall be used for the production of DCE (1,2-dichloroethane) from the mixture of chloride and ethylene. Afterwards, the DCE reacts to form MVC, the monomer for the polymerization process. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "Carbon intensity":1.77,
      "industry":"Chemicals"
  },
  {
      "name":"Polyvinyl Chloride",
      "description":"The Polyvinyl Chloride (PVC; -(CH2-CHCl)n-) is the oldest plastic material. This material is produced from the polymerization of the monomer MVC. Braskem has a chlorine production unit, base material, which shall be used for the production of DCE (1,2-dichloroethane) from the mixture of chloride and ethylene. Afterwards, the DCE reacts to form MVC, the monomer for the polymerization process. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "Carbon intensity":1.77,
      "industry":"Chemicals"
  },
  {
      "name":"Polyvinyl Chloride",
      "description":"The Polyvinyl Chloride (PVC; -(CH2-CHCl)n-) is the oldest plastic material. This material is produced from the polymerization of the monomer MVC. Braskem has a chlorine production unit, base material, which shall be used for the production of DCE (1,2-dichloroethane) from the mixture of chloride and ethylene. Afterwards, the DCE reacts to form MVC, the monomer for the polymerization process. The figure provide in column \"Total emissions in kg CO2e per unit\" has the dimension of tCO2e\/ ton product.",
      "Carbon intensity":1.77,
      "industry":"Chemicals"
  },
  {
      "name":"Acer 15.6\" Notebook",
      "description":"Field not included in 2013 data",
      "Carbon intensity":3.73,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"LCD PC",
      "description":"LCD PC  in our company is for  Dell",
      "Carbon intensity":1.6,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"PND",
      "description":"PND   in our company is for  Vodafone and Wal-Mart",
      "Carbon intensity":10.2,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Note book",
      "description":"Note book in our company is for Dell and Acer",
      "Carbon intensity":1.33,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Auto",
      "description":"Auto   in our company is for  Vodafone and Wal-Mart",
      "Carbon intensity":10.2,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Watch",
      "description":"Watch   in our company is for  Vodafone and Wal-Mart",
      "Carbon intensity":10.2,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Camera",
      "description":"camera   in our company is for  Microsoft",
      "Carbon intensity":10.2,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Camera",
      "description":"Camera in our company is for Microsoft",
      "Carbon intensity":21.2,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"AIO",
      "description":"AIO in our company is for Acer",
      "Carbon intensity":0.67,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"AIO",
      "description":"AIO in our company is for HP",
      "Carbon intensity":0.66,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Notebook",
      "description":"Notebook in our company is for Acer",
      "Carbon intensity":1.83,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Server",
      "description":"Server in our company is for Microsoft",
      "Carbon intensity":0.12,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Tablet",
      "description":"Tablet in our company is for HP",
      "Carbon intensity":15.14,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Servers",
      "description":"Servers   in our company is for  Cisco and Microsoft",
      "Carbon intensity":3.25,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"VR",
      "description":"VR  in our company is for Acer",
      "Carbon intensity":10.29,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"DT",
      "description":"DT  in our company is for Acer",
      "Carbon intensity":1.6,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Phone",
      "description":"Phone in our company is for  Acer",
      "Carbon intensity":1.6,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Pad",
      "description":"PAD in our company is for  Acer",
      "Carbon intensity":1.6,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"CHROMEBOX",
      "description":"CHROMEBOX  in our company is for  Dell",
      "Carbon intensity":1.6,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Lamp",
      "description":"Lamp  in our company is for  Dell",
      "Carbon intensity":1.6,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"POS",
      "description":"POS in our company is for  Dell",
      "Carbon intensity":1.6,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Speaker",
      "description":"Speeker in our company is for  Dell",
      "Carbon intensity":1.6,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Tire including low fuel consumption tire; e.g. ECOPIA series",
      "description":"Tire including low fuel consumption tire based on the labelling system considered as voluntary standards by the industry and designed by JATMA (Japan Automobile Tyre Manufacturers Association). We are making efforts to lower average rolling resistance of tire. Total emissions in kg CO2e per unit [in this report] is calculated in case of ECOPIA as an example.",
      "Carbon intensity":13.01,
      "industry":"Auto Components"
  },
  {
      "name":"Air Purifier",
      "description":"It filters polluted air such as dust and yellow dust using a special filter, and cleans the indoor air in homes or offices.",
      "Carbon intensity":17.5,
      "industry":"Household Durables"
  },
  {
      "name":"Folding boxboard produced at the Maule and Valdivia mills.",
      "description":"Folding boxboard produced at the Maule and Valdivia mills.",
      "Carbon intensity":0.55,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Folding boxboard",
      "description":"Folding boxboard produced at the Maule and Valdivia mills.",
      "Carbon intensity":0.55,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Folding boxboard",
      "description":"Folding boxboard produced at the Maule and Valdivia mills.",
      "Carbon intensity":0.45,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Tako CX Lite",
      "description":"Tako CX Lite is a fully coated bleached paperboard with an uncoated back, based on 100% fresh forest fibres. It is suitable for gravure and offset printing and is available in sheets and reels. Typical end use is cigarette packaging.",
      "Carbon intensity":0.92,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Tako CX Lite S",
      "description":"Tako CX Lite S is a fully coated bleached paperboard with uncoated back based on 100% fresh forest fibres. It is suitable for gravure and offset printing and it is available in sheets and reels. Typical end use is cigarette packaging.",
      "Carbon intensity":0.92,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Simcote is a fully coated folding boxboard with a washed groundwood middle layer, based on 100 % fresh forest fibres. Typical end-uses are food and general packaging.",
      "description":"Simcote Simcote is a fully coated folding boxboard with a washed groundwood middle layer, based on 100 % fresh forest fibres. Typical end-uses are food and general packaging.",
      "Carbon intensity":0.6,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Simcote",
      "description":"Simcote is a fully coated folding boxboard with a washed groundwood middle layer, based on 100 % fresh forest fibres. Typical end-uses are food and general packaging.",
      "Carbon intensity":0.78,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Tako CX Lite S2",
      "description":"Tako CX Lite S2 is a fully coated bleached paperboard with uncoated back based on 100% fresh forest fibres. It is suitable for gravure and offset printing and it is available in sheets and reels. Typical end use is cigarette packaging.",
      "Carbon intensity":0.92,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Tako CX Lite OBA",
      "description":"Tako CX Lite OBA is a fully coated bleached paperboard with an uncoated back based on 100% fresh forest fibres. It is suitable for gravure and offset printing and is available in sheets and reels. Typical end use is cigarette packaging.",
      "Carbon intensity":0.92,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Tako CX White S",
      "description":"Tako CX White S is a fully coated bleached paperboard with a coated back, based on 100 % fresh forest fibres. It is suitable for gravure and offset printing and it is available in sheets and reels. Typical end use is cigarette packaging.",
      "Carbon intensity":0.9,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Mets\u00c3\u00a4 Board Classic FBB (Simcote)",
      "description":"Mets\u00c3\u00a4Board Classic FBB is a fully coated folding boxboard (GC2) available in a basis weight range of 200-340 g\/m\u00c2\u00b2 and suitable for offset, flexo and digital printing.",
      "Carbon intensity":0.81,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Mets\u00c3\u00a4 Board Classic FBB CX (Tako Lite CX))",
      "description":"Mets\u00c3\u00a4Board Classic FBB CX is a fully coated paperboard, without optical brightening agents, available in a basis weight range of 200-225 g\/m\u00c2\u00b2. It is highly suitable for gravure, offset and flexo printing.",
      "Carbon intensity":0.77,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Mets\u00c3\u00a4 Board Natural FSB Cup - new product",
      "description":"Mets\u00c3\u00a4Board Natural FSB Cup is an uncoated food service board, available in a basis weight range of 185-355 g\/m\u00c2\u00b2, suitable for offset and flexo printing.",
      "Carbon intensity":0.37,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Mets\u00c3\u00a4 Board Prime FBB (Carta Elega)",
      "description":"Mets\u00c3\u00a4Board Prime FBB is a fully coated bleached paperboard with coated back, available in a basis weight range of 205-380g\/m\u00c2\u00b2 and suitable for offset, gravure, flexo and digital printing.",
      "Carbon intensity":0.8,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Mets\u00c3\u00a4 Board Prime FBB Bright (Carta Integra)",
      "description":"Mets\u00c3\u00a4Board Prime FBB Bright is a fully coated bleached paperboard with coated back, available in a basis weight range of 170-330 g\/m\u00c2\u00b2 and suitable for offset, gravure, flexo and digital printing.",
      "Carbon intensity":0.53,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Mets\u00c3\u00a4 Board Prime FBB CX (Tako CX White S)",
      "description":"Mets\u00c3\u00a4Board Prime FBB CX is a fully coated paperboard with coated back, available in a basis weight range of 215-240 g\/m\u00c2\u00b2 and suitable for gravure, offset and flexo printing.",
      "Carbon intensity":0.77,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Mets\u00c3\u00a4 Board Prime FBB CXB (Carta Allura)",
      "description":"Mets\u00c3\u00a4Board Prime FBB CXB is a fully coated bleached paperboard with coated back, available in a basis weight range of 225-260 g\/m\u00c2\u00b2 and suitable for offset, gravure, flexo and digital printing.",
      "Carbon intensity":0.77,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Carta Elega is a fully coated folding boxboard, GC1, based on 100 % fresh forest fibres. Typical end uses are cosmetics and other luxury packagings and graphical applications.",
      "description":"Carta Elega Carta Elega is a fully coated folding boxboard, GC1, based on 100 % fresh forest fibres. Typical end uses are cosmetics and other luxury packagings and graphical applications.",
      "Carbon intensity":0.48,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Carta Elega",
      "description":"Carta Elega is a fully coated folding boxboard, GC1, based on 100 % fresh forest fibres. Typical end uses are cosmetics and other luxury packagings and graphical applications.",
      "Carbon intensity":0.8,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Mets\u00c3\u00a4 Board Prime FBB CXL (Tako HiD L JTI)",
      "description":"Mets\u00c3\u00a4Board Prime FBB CX is a fully coated paperboard with coated back, available in basis weight range of 235 g\/m\u00c2\u00b2 and is suitable for gravure, offset and flexo printing.",
      "Carbon intensity":0.77,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Mets\u00c3\u00a4 Board Prime FBB CXX (Tako HiD X JTI)",
      "description":"Mets\u00c3\u00a4Board Prime FBB CX is a fully coated paperboard with coated back, available in basis weight 270 g\/m\u00c2\u00b2 and is suitable for gravure, offset and flexo printing.",
      "Carbon intensity":0.77,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Mets\u00c3\u00a4 Board Pro FBB (Avanta Prima)",
      "description":"Mets\u00c3\u00a4Board Pro FBB is a fully coated folding boxboard (GC2) available in a basis weight range of 205-355 g\/m\u00c2\u00b2 and suitable for offset, gravure, flexo and digital printing.",
      "Carbon intensity":0.81,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Mets\u00c3\u00a4 Board Pro FBB Bright (Carta Solida)",
      "description":"Mets\u00c3\u00a4Board Pro FBB Bright is a fully coated bleached paperboard with white back, available in a basis weight range of 185-350 g\/m\u00c2\u00b2 and suitable for offset, gravure, flexo and digital printing as well as for litholamination",
      "Carbon intensity":0.53,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Mets\u00c3\u00a4 Board Pro FBB CX (Tako CX Lite S)",
      "description":"Mets\u00c3\u00a4Board Pro FBB CX is a fully coated paperboard, available in a basis weight range of 200-225g\/m\u00c2\u00b2, suitable for gravure, offset and flexo printing.",
      "Carbon intensity":0.78,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Avanta Prima is a fully coated folding boxboard, GC2, based on 100 % fresh forest fibress. Typical end uses are high-quality pharmaceuticals, daily cosmetics and food packagings.",
      "description":"Avanta Prima Avanta Prima is a fully coated folding boxboard, GC2, based on 100 % fresh forest fibress. Typical end uses are high-quality pharmaceuticals, daily cosmetics and food packagings.",
      "Carbon intensity":0.48,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Avanta Prima",
      "description":"Avanta Prima is a fully coated folding boxboard, GC2, based on 100 % fresh forest fibress. Typical end uses are high-quality pharmaceuticals, daily cosmetics and food packagings.",
      "Carbon intensity":0.81,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Carta Solida is a fully coated BCTMP board with a white back, based on 100 % fresh forest fibres. Carta Solida is suitable for packaging and graphical end uses and it is available in reels and sheets.",
      "description":"Carta Solida Carta Solida is a fully coated BCTMP board with a white back, based on 100 % fresh forest fibres. Carta Solida is suitable for packaging and graphical end uses and it is available in reels and sheets.",
      "Carbon intensity":0.36,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Carta Solida",
      "description":"Carta Solida is a fully coated BCTMP board with a white back, based on 100 % fresh forest fibres. Carta Solida is suitable for packaging and graphical end uses and it is available in reels and sheets.",
      "Carbon intensity":0.53,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Carta Integra is a fully coated BCTMP board with a coated back,  based on 100 % fresh forest fibres. Carta Integra is suitable for graphical and packaging end uses and it is available in reels and sheets.",
      "description":"Carta Integra Carta Integra is a fully coated BCTMP board with a coated back,  based on 100 % fresh forest fibres. Carta Integra is suitable for graphical and packaging end uses and it is available in reels and sheets.",
      "Carbon intensity":0.36,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Carta Integra",
      "description":"Carta Integra is a fully coated BCTMP board with a coated back, based on 100 % fresh forest fibres. Carta Integra is suitable for graphical and packaging end uses and it is available in reels and sheets.",
      "Carbon intensity":0.53,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Kemiart Brite is a tradional white top kraftliner for retail packages with large colour-printed areas and line pictures with excellent contrast, based on 100 % fresh forest fibres. It is used for corrugated packaging.",
      "description":"Kemiart Brite Kemiart Brite is a tradional white top kraftliner for retail packages with large colour-printed areas and line pictures with excellent contrast, based on 100 % fresh forest fibres. It is used for corrugated packaging.",
      "Carbon intensity":0.4,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Batabak 515 is a fully coated bleached paperboard with uncoated back, based on 100 % fresh forest fibres. Typical end use is cigarette packaging.",
      "description":"Batabak 515 is a fully coated bleached paperboard with uncoated back, based on 100 % fresh forest fibres. Typical end use is cigarette packaging.",
      "Carbon intensity":0.78,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Batabak 580 is a fully coated bleached paperboard with  a coated back, based on 100 % fresh forest fibres. Typical end use is cigarette packaging.",
      "description":"Batabak 580 is a fully coated bleached paperboard with  a coated back, based on 100 % fresh forest fibres. Typical end use is cigarette packaging.",
      "Carbon intensity":0.79,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Batabak 510 is a fully coated bleached paperboard with uncoated back, based on 100 % fresh forest fibres. Typical end use is cigarette packaging.",
      "description":"Batabak 510 is a fully coated bleached paperboard with uncoated back, based on 100 % fresh forest fibres. Typical end use is cigarette packaging.",
      "Carbon intensity":0.78,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Glass container",
      "description":"355ml carbonated beverage container from Asia-Pacific",
      "Carbon intensity":0.37,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Glass container",
      "description":"355ml carbonated beverage container from Europe",
      "Carbon intensity":0.26,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Glass container",
      "description":"355ml carbonated beverage container from Latin America",
      "Carbon intensity":0.28,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Glass container",
      "description":"355ml carbonated beverage container from North America",
      "Carbon intensity":0.41,
      "industry":"Containers & Packaging"
  },
  {
      "name":"BillerudKorsn\u00c3\u00a4s Liquid LC",
      "description":"Liquid Packaging Board with the grammages of 272 and 280 aimed for converting to beverage cartons.",
      "Carbon intensity":0.41,
      "industry":"Containers & Packaging"
  },
  {
      "name":"BillerudKorsn\u00c3\u00a4s Liquid LC",
      "description":"Liquid Packaging Board with the grammages of 272 and 280 aimed for converting to beverage cartons.",
      "Carbon intensity":0.41,
      "industry":"Packaging for consumer goods"
  },
  {
      "name":"TFT-LCD products is the use of the optical properties of liquid crystals to achieve the image display, liquid crystal main structure is poured into the vacuum between the two pieces of glass, glass, applied voltage and control the proper spacing of the deflection characteristics of the incident light can be changed to to image display. For the automobile products's TFT-LCD Module, the product is defined as B to B (Business to Business) products, ranging from the cradle to the door inventory, according to standard PCR system boundaries should be compulsory included in carbon footprint assessment phase are as follows:  . Mining and raw materials made  . Manufacture of major components  . Transport components  . Product assembly stage. The models 069LA of automobile panel was complete the dual certification of carbon footprint and water footprint  by SGS in 2011.",
      "description":"TFT-LCD products is the use of the optical properties of liquid crystals to achieve the image display, liquid crystal main structure is poured into the vacuum between the two pieces of glass, glass, applied voltage and control the proper spacing of the deflection characteristics of the incident light can be changed to to image display. For the automobile products's TFT-LCD Module, the product is defined as B to B (Business to Business) products, ranging from the cradle to the door inventory, according to standard PCR system boundaries should be compulsory included in carbon footprint assessment phase are as follows:  . Mining and raw materials made  . Manufacture of major components  . Transport components  . Product assembly stage. The models 069LA of automobile panel was complete the dual certification of carbon footprint and water footprint  by SGS in 2011.",
      "Carbon intensity":42.86,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Coca-Cola (all packaging and sizes)",
      "description":"Coca-Cola soft drink",
      "Carbon intensity":0.15,
      "industry":"Beverages"
  },
  {
      "name":"Coca-Cola (all packaging and sizes)",
      "description":"Coca-Cola soft drink (carbonated non-alcoholic  beverage)",
      "Carbon intensity":0.14,
      "industry":"Food & Beverage"
  },
  {
      "name":"Coca-Cola (all packaging and sizes)",
      "description":"Coca-Cola soft drink (carbonated non-alcoholic beverage)",
      "Carbon intensity":0.13,
      "industry":"Beverages"
  },
  {
      "name":"Wind Turbine G90 2 Megawats",
      "description":"Cradle to grave emissions of a Wind Turbine G90 2 Megawats",
      "Carbon intensity":3.47,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"Wind Turbine G114 2 Megawats",
      "description":"Cradle to grave emissions of a Wind Turbine G114 2 Megawats. Tower 93 m3ters",
      "Carbon intensity":3.83,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"Wind Turbine G128 5 Megawats",
      "description":"Cradle to grave emissions of a Wind Turbine G128 5 Megawats. Hibrid tower 140 meters",
      "Carbon intensity":6.2,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"Wind Turbine G132 5 Megawats",
      "description":"Cradle to grave emissions of a Wind Turbine G132 5 Megawats. Metallic tower of 95 meters",
      "Carbon intensity":5.46,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"HP EliteDisplay E201 20-inch LED Backlit Monitor",
      "description":"Field not included in 2013 data",
      "Carbon intensity":42.25,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"HP Compaq LA2206xc 21.5-inch Webcam Monitor",
      "description":"Field not included in 2013 data",
      "Carbon intensity":45.78,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"HP LaserJet Enterprise M4555fskm MFP (note that this product is representative of 61 similar products for which full LCAs were performed)",
      "description":"HP LaserJet Enterprise M4555fskm MFP (note that this product is representative of 61 similar products for which full LCAs were performed)",
      "Carbon intensity":306.67,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"HP Compaq LA2405x 24-inch LED Backlit Monitor",
      "description":"Field not included in 2013 data",
      "Carbon intensity":45.54,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"HP Envy 120 InkJet Printer",
      "description":"Field not included in 2013 data",
      "Carbon intensity":32.14,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"HP ScanJet 7500 (note that this product is representative of 5 similar products for which full LCAs were performed)",
      "description":"HP ScanJet 7500 (note that this product is representative of 5 similar products for which full LCAs were performed)",
      "Carbon intensity":24.7,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"HP Compaq Elite 8300 USDT PC",
      "description":"Field not included in 2013 data",
      "Carbon intensity":135.48,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"HP Compaq 8200 Elite SFF Business PC",
      "description":"Field not included in 2013 data",
      "Carbon intensity":65.79,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"HP Compaq Elite 8300 MT PC",
      "description":"Field not included in 2013 data",
      "Carbon intensity":51.79,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"HP EliteBook Folio 9470m",
      "description":"Field not included in 2013 data",
      "Carbon intensity":142.86,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"HP EliteBook 8460p Notebook PC",
      "description":"Field not included in 2013 data",
      "Carbon intensity":128.89,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"HP EliteBook 8570w Mobile Workstation",
      "description":"Field not included in 2013 data",
      "Carbon intensity":123.33,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Canvas Wood Lateral",
      "description":"Office Storage",
      "Carbon intensity":0.77,
      "industry":"Household Durables"
  },
  {
      "name":"Canvas Wood Pedestal 2016",
      "description":"Office Storage",
      "Carbon intensity":0.87,
      "industry":"Household Durables"
  },
  {
      "name":"Embody Chair",
      "description":"Office Seating",
      "Carbon intensity":4.15,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Embody Chair",
      "description":"Office Seating",
      "Carbon intensity":4.15,
      "industry":"Household Durables"
  },
  {
      "name":"Canvas Wood Tower",
      "description":"Office Storage",
      "Carbon intensity":0.4,
      "industry":"Household Durables"
  },
  {
      "name":"New Aeron Chair",
      "description":"Office Seating",
      "Carbon intensity":4.5,
      "industry":"Household Durables"
  },
  {
      "name":"Caper Stacking Chair",
      "description":"Office Seating",
      "Carbon intensity":2.73,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Caper Stacking Chair",
      "description":"Office Seating",
      "Carbon intensity":2.73,
      "industry":"Household Durables"
  },
  {
      "name":"Aeron Chair",
      "description":"Office Seating",
      "Carbon intensity":3.65,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Aeron Chair",
      "description":"Office Seating",
      "Carbon intensity":3.93,
      "industry":"Household Durables"
  },
  {
      "name":"Mirra 2 Chair",
      "description":"Office Seating",
      "Carbon intensity":5.51,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Mirra 2 Chair",
      "description":"Office Seating",
      "Carbon intensity":5.51,
      "industry":"Household Durables"
  },
  {
      "name":"Sayl Work Chair, Suspension Back",
      "description":"Office Seating",
      "Carbon intensity":4.76,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Sayl Work Chair, Suspension Back",
      "description":"Office Seating",
      "Carbon intensity":4.76,
      "industry":"Household Durables"
  },
  {
      "name":"Setu Multipurpose Chair with Lyris 2",
      "description":"Office Seating",
      "Carbon intensity":6.23,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Setu Multipurpose chair with Lyris 2",
      "description":"Office Seating",
      "Carbon intensity":6.23,
      "industry":"Household Durables"
  },
  {
      "name":"Celle Chair",
      "description":"Office Seating",
      "Carbon intensity":2.89,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Celle Chair",
      "description":"Office Seating",
      "Carbon intensity":2.89,
      "industry":"Household Durables"
  },
  {
      "name":"Aeron Work Stool",
      "description":"Office Seating",
      "Carbon intensity":2.92,
      "industry":"Household Durables"
  },
  {
      "name":"Canvas Wood Credenza 2016",
      "description":"Office Storage",
      "Carbon intensity":0.76,
      "industry":"Household Durables"
  },
  {
      "name":"Graphite 2500 DECT",
      "description":"A Digital Enhanced Cordless Telecommunications (DECT) phone",
      "Carbon intensity":3.36,
      "industry":"Diversified Telecommunication Services"
  },
  {
      "name":"Graphite 2500 DECT",
      "description":"A Digital Enhanced Cordless Telecommunications (DECT) phone",
      "Carbon intensity":3.36,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Home Hub 2.0",
      "description":"A wireless gateway router providing wireless internet access in domestic properties (a final product).",
      "Carbon intensity":51.82,
      "industry":"Diversified Telecommunication Services"
  },
  {
      "name":"Home Hub 2.0",
      "description":"A wireless gateway router providing wireless internet access in domestic properties (a final product).",
      "Carbon intensity":51.82,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Home Hub 3.0",
      "description":"A wireless gateway router providing wireless internet access in domestic properties (a final product).",
      "Carbon intensity":27.5,
      "industry":"Diversified Telecommunication Services"
  },
  {
      "name":"Home Hub 3.0",
      "description":"A wireless gateway router providing wireless internet access in domestic properties (a final product).",
      "Carbon intensity":27.5,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Vision+ box",
      "description":"A Freeview box and digital TV recorder in a single unit",
      "Carbon intensity":51.76,
      "industry":"Diversified Telecommunication Services"
  },
  {
      "name":"Vision+ box",
      "description":"A Freeview box and digital TV recorder in a single unit",
      "Carbon intensity":51.76,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Carbon Black",
      "description":"Metric ton of carbon black (all grades produced at all manufacturing locations)",
      "Carbon intensity":2.28,
      "industry":"Chemicals"
  },
  {
      "name":"Multi Function Printer",
      "description":"Canon Multi Function Printers produce easily copy, scan and print important documents in a convenient, easy to use machine.",
      "Carbon intensity":0.55,
      "industry":"Office Electronics"
  },
  {
      "name":"Multi Function Printer with a built-in facsimile",
      "description":"Canon Multi Function Printers produce easily copy, scan, fax and print important documents in a convenient, easy to use machine.",
      "Carbon intensity":1.84,
      "industry":"Office Electronics"
  },
  {
      "name":"Digital camera",
      "description":"Shoot high-quality digital photos with Canon PowerShot digital cameras. Canon PowerShot cameras offer the best in digital camera technology, style and ease of use. Canon's optics, DIGIC processor and stunning design make PowerShot digital cameras the best choice for photographers at any level.",
      "Carbon intensity":23.51,
      "industry":"Office Electronics"
  },
  {
      "name":"Single Lens Reflex camera system",
      "description":"The Canon EOS Camera System is the most complete Single Lens Reflex (SLR) camera system in the world. Whether you are a beginner or advanced professional looking for a digital camera, the EOS System takes your photography to the next level.",
      "Carbon intensity":12.42,
      "industry":"Office Electronics"
  },
  {
      "name":"Ingeo--biopolymer (polylactid) made from corn starch",
      "description":"Ingeo--biopolymer (polylactid) made from corn starch",
      "Carbon intensity":1.3,
      "industry":"Food Products"
  },
  {
      "name":"Ingeo",
      "description":"Ingeo--biopolymer (polylactid) made from corn starch",
      "Carbon intensity":1.3,
      "industry":"Food Products"
  },
  {
      "name":"Series 29 Hydrant - Squat Hydrant suitable for use with water and neutral liquids, to a maximum temperature of 70 degrees centigrade. Complies with requirements of BS750:2006 and BSEN1074-2:2004 and EN14339:2005, underground hydrants. Also to BS EN 1074-6 for potable (drinking) water. This product has kitemark and WRAS approval. The 2938832112 replaces the 2928832112.",
      "description":"Series 29 Hydrant - Squat Hydrant suitable for use with water and neutral liquids, to a maximum temperature of 70 degrees centigrade. Complies with requirements of BS750:2006 and BSEN1074-2:2004 and EN14339:2005, underground hydrants. Also to BS EN 1074-6 for potable (drinking) water. This product has kitemark and WRAS approval. The 2938832112 replaces the 2928832112.",
      "Carbon intensity":2.41,
      "industry":"Trading Companies & Distributors"
  },
  {
      "name":"Series 29\/388 Squat Hydrant",
      "description":"The series 29 Squat Hydrant is suitable for use with water and neutral liquids, to a maximum temperature of 70 degrees centigrade. This product complies with requirements of BS750:2006 and BSEN1074-2:2004 and EN14339:2005, underground hydrants. Also to BS EN 1074-6 for potable (drinking) water. This product has kitemark and WRAS approval. The 2938832112 replaces the 2928832112.",
      "Carbon intensity":2.31,
      "industry":"Trading Companies & Distributors"
  },
  {
      "name":"The series 21\/75 is a resilient seat, wedge gate valve for isolation purposes, suitable for use with water and neutral liquids (sewage), to a maximum temperature of +70 degrees centegrade. The series 21\/75 is a new alternative to a series 21\/50 in some applications. Therefore where a 21\/75 is sold we can calculate the emissions saved in contrast to the sale of a 21\/50.",
      "description":"The series 21\/75 is a resilient seat, wedge gate valve for isolation purposes, suitable for use with water and neutral liquids (sewage), to a maximum temperature of +70 degrees centegrade. The series 21\/75 is a new alternative to a series 21\/50 in some applications. Therefore where a 21\/75 is sold we can calculate the emissions saved in contrast to the sale of a 21\/50.",
      "Carbon intensity":2.29,
      "industry":"Trading Companies & Distributors"
  },
  {
      "name":"Gas Product - Small 555 series cast iron softseal valve, PN16. This series 555 softseal valve is a double-faced, resilient seat wedge gate valve. It is designed primarily for the isolation of natural gas and towns gas. Kitemark approved for GIS\/V7 part 1.",
      "description":"Gas Product - Small 555 series cast iron softseal valve, PN16. This series 555 softseal valve is a double-faced, resilient seat wedge gate valve. It is designed primarily for the isolation of natural gas and towns gas. Kitemark approved for GIS\/V7 part 1.",
      "Carbon intensity":1.92,
      "industry":"Trading Companies & Distributors"
  },
  {
      "name":"Series 555\/300 Gate Valve",
      "description":"The series 555 cast iron softseal valve, PN16, is a double-faced, resilient seat wedge gate valve. It is designed primarily for the isolation of natural gas and towns gas. Kitemark approved for GIS\/V7 part 1.",
      "Carbon intensity":1.45,
      "industry":"Trading Companies & Distributors"
  },
  {
      "name":"Series 21\/50 Gate Valve",
      "description":"The series 21\/50 is a resilient seat gate valve to BS EN 1074-2 \/ BS 5163-1,(ductile iron) for isolation purposes, suitable for use with water and neutral liquids (sewage) to a maximum temperature of up to +70\u00c2\u00b0C.",
      "Carbon intensity":1.53,
      "industry":"Trading Companies & Distributors"
  },
  {
      "name":"Series 202\/31 Repair Clamp",
      "description":"The series 202\/31 Supacollar is a multiple band repair clamp, for all ferrous pipes, PVC and AC.",
      "Carbon intensity":8.15,
      "industry":"Trading Companies & Distributors"
  },
  {
      "name":"See attached sheet",
      "description":"Canned tomato products",
      "Carbon intensity":0.21,
      "industry":"Food Products"
  },
  {
      "name":"Ecoworx Carpet Tile with Shaw's Eco Solution Q Nylon 6 face fiber",
      "description":"Ecoworx Carpet Tile with Shaw's Eco Solution Q Nylon 6 face fiber",
      "Carbon intensity":54.5,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"PET preforms for bottles",
      "description":"PET preforms are dedicated for production of plastic bottles which are formed by using the blow moulding technology. Producers of soft drinks, mineral water, juices, beer and edible oils use this safe and handly PET packing for their products.",
      "Carbon intensity":0.36,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Page Printer SPEEDIA N3600",
      "description":"Field not included in 2013 data",
      "Carbon intensity":52.09,
      "industry":"Household Durables"
  },
  {
      "name":"SPEEDIA N3600",
      "description":"Page Printer",
      "Carbon intensity":52.09,
      "industry":"Household Durables"
  },
  {
      "name":"Lineal Alkyl Bencene (LAB)",
      "description":"(i) LAB produced in facilities of Brazil(ii) Production Emissions given per tonne of LAB",
      "Carbon intensity":6.11,
      "industry":"Oil, Gas & Consumable Fuels"
  },
  {
      "name":"Lineal Alkyl Bencene (LAB)",
      "description":"(i) LAB produced in facilities of Puente Mayorga (ii) Production Emissions given per tonne of LAB",
      "Carbon intensity":0.89,
      "industry":"Oil, Gas & Consumable Fuels"
  },
  {
      "name":"E - Series Solar Panels (SPR-327NE-WHT-D AR modules)",
      "description":"SunPower\u00c2\u00ae E-Series solar panels deliver efficient performance and long-lasting durability at a great value. Compared to other technologies, SunPower converts the greatest percentage of sunlight into electricity. This means that over the lifetime of your system, you\u00c2\u0092ll generate more electricity and save more money on your electricity bills. \u00c2\u0095More energy from less space: SunPower E-Series solar panels convert more sunlight into electricity than conventional panels, delivering 36% more power per panel. \u00c2\u0095More electricity: SunPower E-Series residential solar panels convert more sunlight to electricity over the life of your system than conventional panels. Which means you produce 60% more energy over 25 years and save more on your electricity bills, too. \u00c2\u0095More flexibility: Because E-Series residential solar panels generate more electricity from a smaller area, you can expand energy production simply by using additional roof space to add more panels later. \u00c2\u0095More peace of mind: More guaranteed power. SunPower offers the best combined power and product warranty over 25 years. \u00c2\u0095The panels are designed to deliver consistent, trouble-free energy over a very long lifetime.",
      "Carbon intensity":15.11,
      "industry":"Electrical Equipment"
  },
  {
      "name":"Droid Razr",
      "description":"Field not included in 2013 data",
      "Carbon intensity":235.91,
      "industry":"Household Durables"
  },
  {
      "name":"50\u00c2\u0094 TFT-LCD TV module which consisted of the following main components: PCBA, converter, TFT-LCD panel, LED backlight",
      "description":"50\u00c2\u0094 TFT-LCD TV module which consisted of the following main components: PCBA, converter, TFT-LCD panel, LED backlight",
      "Carbon intensity":9.69,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Can\/Bottle vending machine  -30Selections  -Cooling \/ warming  - R744 Heat Pump Refrigeration System  - LED Lighting",
      "description":"Can\/Bottle vending machine  -30Selections  -Cooling \/ warming  - R744 Heat Pump Refrigeration System  - LED Lighting",
      "Carbon intensity":9.17,
      "industry":"Machinery"
  },
  {
      "name":"Vending Machine",
      "description":"Can\/Bottle vending machine -30 Selections- Cooling \/ Warming -  R744 Heat Pump Refrigeration System - LED Lighting",
      "Carbon intensity":7.02,
      "industry":"Machinery"
  },
  {
      "name":"Vending Machine",
      "description":"Can\/Bottle vending machine - 30 Selections, Cooling \/ Warming, Heat Pump Refrigeration System, LED Lighting",
      "Carbon intensity":6.62,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"Sodium sulphate",
      "description":"sodium sulphate",
      "Carbon intensity":0.18,
      "industry":"Chemicals"
  },
  {
      "name":"sodium sulphate",
      "description":"sodium sulphate",
      "Carbon intensity":0.14,
      "industry":"Chemicals"
  },
  {
      "name":"IP Phone",
      "description":"Field not included in 2013 data",
      "Carbon intensity":79.43,
      "industry":"Communications Equipment"
  },
  {
      "name":"Small Rack Mount Switch",
      "description":"Field not included in 2013 data",
      "Carbon intensity":736.5,
      "industry":"Communications Equipment"
  },
  {
      "name":"Walmart Brand Products",
      "description":"Walmart Brand Product Emissions (Reported in kg\/1000 units)  Honey Oatmeal Bread, 24oz  Yeasty Rolls, 17oz  Soft Wheat Roll, 17oz  English Muffin Toasting Bread, 20oz  9-Grain Bread, 22oz",
      "Carbon intensity":0.36,
      "industry":"Food & Staples Retailing"
  },
  {
      "name":"Walmart Brand Products",
      "description":"Walmart Brand Product Emissions (Reported in kg\/1000 units)  12-Grain Bread, Natural Wheat Bread, Honey Oatmeal Bread, Yeasty Rolls, and Soft Wheat Rolls",
      "Carbon intensity":0.39,
      "industry":"Food & Beverage"
  },
  {
      "name":"Walmart Brand Products",
      "description":"Walmart Brand Product Emissions (Reported in kg CO2e\/lb units)  12-Grain Bread, Honey Oatmeal Bread, Yeasty Dinner Rolls, Seeded Rye Bread, Pumpernickel Bread",
      "Carbon intensity":0.31,
      "industry":"Beverages"
  },
  {
      "name":"GMP (5'-Guanylate)",
      "description":"Flavor enhancer",
      "Carbon intensity":24.84,
      "industry":"Beverages"
  },
  {
      "name":"I&G (5'-Ribonucleotide)",
      "description":"Flavor enhancer",
      "Carbon intensity":21.13,
      "industry":"Beverages"
  },
  {
      "name":"IMP (5'-Inosinate)",
      "description":"Flavor enhancer",
      "Carbon intensity":18.04,
      "industry":"Beverages"
  },
  {
      "name":"L-Arginine",
      "description":"Food grade amino acid",
      "Carbon intensity":26.84,
      "industry":"Beverages"
  },
  {
      "name":"MSG (Monosodium Glutamate)",
      "description":"Flavor enhancer",
      "Carbon intensity":3.86,
      "industry":"Beverages"
  },
  {
      "name":"SUGAR",
      "description":"Food Ingredients",
      "Carbon intensity":0.11,
      "industry":"Beverages"
  },
  {
      "name":"Nicotine",
      "description":"Nicotine (i) 1 kg of nicotine (ii) requires further processing and transformation by third party.",
      "Carbon intensity":16.88,
      "industry":"Tobacco"
  },
  {
      "name":"Organic pigments. PCF value for organic pigments, cradle to gate",
      "description":"Organic pigments. PCF value for organic pigments, cradle to gate",
      "Carbon intensity":26.0,
      "industry":"Chemicals"
  },
  {
      "name":"PCF value for metal and effect pigments, cradle to gate",
      "description":"PCF value for metal and effect pigments, cradle to gate",
      "Carbon intensity":26.0,
      "industry":"Chemicals"
  },
  {
      "name":"Organic Pigments",
      "description":"Product Carbon Footprint for organic pigments, cradle to gate calculation.",
      "Carbon intensity":26.0,
      "industry":"Chemicals"
  },
  {
      "name":"Organic Pigments",
      "description":"Product carbon footprint for organic pigments, cradle to gate calculation",
      "Carbon intensity":26.0,
      "industry":"Chemicals"
  },
  {
      "name":"De-icing fluids",
      "description":"De-icing on-site recycling at airport",
      "Carbon intensity":1.85,
      "industry":"Chemicals"
  },
  {
      "name":"Exolit ammonium polyphosphate\t",
      "description":"Non-halogenated flame retardants",
      "Carbon intensity":5.0,
      "industry":"Chemicals"
  },
  {
      "name":"Exolit OP phosphinates\t",
      "description":"Non-halogenated flame retardants",
      "Carbon intensity":9.0,
      "industry":"Chemicals"
  },
  {
      "name":"Sunliquid\t",
      "description":"Advanced biofuels: ethanol from wheat straw",
      "Carbon intensity":0.12,
      "industry":"Chemicals"
  },
  {
      "name":"Verre Infini, perfumery glass made only with domestic glass from segregation. Middle bottle weighing 100g",
      "description":"Verre Infini, perfumery glass made only with domestic glass from segregation. Middle bottle weighing 100g",
      "Carbon intensity":1.24,
      "industry":"Personal Products"
  },
  {
      "name":"Perfumery specific glass. Middle bottle weighing 100g",
      "description":"Perfumery specific glass. Middle bottle weighing 100g",
      "Carbon intensity":1.62,
      "industry":"Personal Products"
  },
  {
      "name":"Interface Brazil Carpet",
      "description":"Square meter of Interface carpet tile sold in Brazil",
      "Carbon intensity":2.35,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Interface Canada Carpet",
      "description":"Square meter of Interface carpet tile sold in Canada",
      "Carbon intensity":2.66,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Interface United States carpet tile (The average square meter of carpet tile sold as Cool Carpet by our Interface business in the United States)",
      "description":"Interface United States carpet tile (The average square meter of carpet tile sold as Cool Carpet by our Interface business in the United States)",
      "Carbon intensity":3.22,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Interface US carpet",
      "description":"Square meter of Interface carpet tile manufactured in the United States",
      "Carbon intensity":3.02,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Interface Global LVT",
      "description":"Square meter of Interface LVT sold globally",
      "Carbon intensity":4.11,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Interface EMEAI carpet tile (The average square meter of carpet tile sold as Cool Carpet by our Interface business in EMEAI)",
      "description":"Interface EMEAI carpet tile (The average square meter of carpet tile sold as Cool Carpet by our Interface business in EMEAI)",
      "Carbon intensity":2.43,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Interface EMEA Carpet",
      "description":"Square meter of Interface carpet tile sold in Europe, the Middle East or Africa",
      "Carbon intensity":2.64,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Interface Thailand carpet tile (The average square meter of carpet tile sold as Cool Carpet by our Interface business in Southeast Asia)",
      "description":"Interface Thailand carpet tile (The average square meter of carpet tile sold as Cool Carpet by our Interface business in Southeast Asia)",
      "Carbon intensity":3.6,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Interface Asia carpet",
      "description":"Square meter of Interface carpet tile manufactured in Thailand",
      "Carbon intensity":3.38,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Interface Thailand Carpet",
      "description":"Square meter of Interface carpet tile sold in SE Asia, Japan, Korea or India",
      "Carbon intensity":2.71,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Interface Australia carpet tile (The average square meter of carpet tile sold as Cool Carpet by our Interface business in Australia)",
      "description":"Interface Australia carpet tile (The average square meter of carpet tile sold as Cool Carpet by our Interface business in Australia)",
      "Carbon intensity":4.12,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Interface Australia Carpet",
      "description":"Square meter of Interface carpet tile sold in Australia",
      "Carbon intensity":3.83,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Interface Australia Carpet",
      "description":"Square meter of Interface carpet  tile sold in Australia",
      "Carbon intensity":3.08,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Interface Europe carpet",
      "description":"Square meter of Interface carpet tile manufactured in Europe",
      "Carbon intensity":2.42,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Interface Europe Carpet",
      "description":"Square meter of Interface carpet tile sold in Europe, Middle East or Africa",
      "Carbon intensity":2.5,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Interface Asia Carpet",
      "description":"Square meter of Interface carpet tile sold in Asia (excluding China)",
      "Carbon intensity":3.27,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Interface Americas Carpet",
      "description":"Square meter of Interface carpet tile sold in the United States, Canada or Latin America",
      "Carbon intensity":3.1,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Interface Americas Carpet",
      "description":"Square meter of Interface carpet tile sold in the United States or Latin America, excluding Brazil",
      "Carbon intensity":2.71,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Interface China Carpet",
      "description":"Square meter of Interface carpet tile sold in China",
      "Carbon intensity":3.71,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Interface China Carpet",
      "description":"Square meter of Interface carpet tile sold in China",
      "Carbon intensity":3.7,
      "industry":"Textiles, Apparel & Luxury Goods"
  },
  {
      "name":"Ethanol. In addition to its use as fuel (in vehicles), ethanol is an input to the food, chemical and cosmetic industries.",
      "description":"Ethanol. In addition to its use as fuel (in vehicles), ethanol is an input to the food, chemical and cosmetic industries.",
      "Carbon intensity":0.95,
      "industry":"Oil, Gas & Consumable Fuels"
  },
  {
      "name":"Coke Zero 330 ml glass bottle",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.63,
      "industry":"Beverages"
  },
  {
      "name":"Coke Zero 500ml PET",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.41,
      "industry":"Beverages"
  },
  {
      "name":"Coca-Cola 300ml can",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.57,
      "industry":"Beverages"
  },
  {
      "name":"Coke Zero- 2 litre plastic bottle",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.2,
      "industry":"Beverages"
  },
  {
      "name":"Oasis Summer Fruits  - 375ml glass",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.57,
      "industry":"Beverages"
  },
  {
      "name":"Oasis Summer Fruits - 500ml plastic bottle",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.44,
      "industry":"Beverages"
  },
  {
      "name":"Coca-Cola 300ml glass bottle",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.73,
      "industry":"Beverages"
  },
  {
      "name":"Coca-Cola 500ml plastic bottle",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.44,
      "industry":"Beverages"
  },
  {
      "name":"Coca-Cola 2 litre plastic bottle",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.25,
      "industry":"Beverages"
  },
  {
      "name":"Diet Coke 300ml can",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.5,
      "industry":"Beverages"
  },
  {
      "name":"Diet Coke 330ml glass bottle",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.63,
      "industry":"Beverages"
  },
  {
      "name":"Diet Coke 500 ml plastic bottle",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.41,
      "industry":"Beverages"
  },
  {
      "name":"Diet Coke - 2 Litre Plastic Bottle",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.2,
      "industry":"Beverages"
  },
  {
      "name":"Coke Zero 300ml can",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.5,
      "industry":"Beverages"
  },
  {
      "name":"Netbook (SKU: High efficient CPU.10.1-inch LED backlight)",
      "description":"Netbook (SKU: High efficient CPU.10.1-inch LED backlight)",
      "Carbon intensity":78.48,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Notebook",
      "description":"Field not included in 2013 data",
      "Carbon intensity":51.09,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Natural Gas",
      "description":"Please note that this factor is representative of our total emissions and natural gas production profile. It is not strictly based upon products sold to NRG.",
      "Carbon intensity":49.6,
      "industry":"Oil, Gas & Consumable Fuels"
  },
  {
      "name":"Plastics",
      "description":"BLANK",
      "Carbon intensity":0.18,
      "industry":"Chemicals"
  },
  {
      "name":"Plastics",
      "description":null,
      "Carbon intensity":0.12,
      "industry":"Chemicals"
  },
  {
      "name":"Latex",
      "description":"BLANK",
      "Carbon intensity":0.21,
      "industry":"Chemicals"
  },
  {
      "name":"Rubber",
      "description":"BLANK",
      "Carbon intensity":0.99,
      "industry":"Chemicals"
  },
  {
      "name":"Rubber",
      "description":null,
      "Carbon intensity":1.15,
      "industry":"Chemicals"
  },
  {
      "name":"Binders",
      "description":null,
      "Carbon intensity":0.21,
      "industry":"Chemicals"
  },
  {
      "name":"T300",
      "description":"BLANK",
      "Carbon intensity":3.62,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"T300",
      "description":"Walk-behind, battery-powered, scrubber-drier",
      "Carbon intensity":24.69,
      "industry":"Electrical Equipment"
  },
  {
      "name":"Pesto alla Genovese sauce",
      "description":"Pesto sauces, branded Barilla, are produced in an owned plant located in Rubbiano (Italy).The product is sold in package of 190 grams jar,",
      "Carbon intensity":2.87,
      "industry":"Food & Staples Retailing"
  },
  {
      "name":"Pasta produced in United States",
      "description":"Durum wheat semolina dried Pasta made by durum semolina and water, with an humidity content of about 13%. It is produced and distributed in United States",
      "Carbon intensity":1.28,
      "industry":"Food & Staples Retailing"
  },
  {
      "name":"Pasta produced in United States",
      "description":"Durum wheat semolina dried Pasta made by durum semolina and water, with an humidity content of about 13%. It is produced and distributed in United States",
      "Carbon intensity":1.32,
      "industry":"Food & Beverage"
  },
  {
      "name":"Pasta produced in Italy (local consumption)",
      "description":"Durum wheat semolina dried Pasta made by durum semolina and water, with an humidity content of about 13%. It is produced and distributed in Italy",
      "Carbon intensity":0.95,
      "industry":"Food & Staples Retailing"
  },
  {
      "name":"Pasta produced in Italy (local consumption)",
      "description":"Durum wheat semolina dried Pasta made by durum semolina and water, with an humidity content of about 13%. It is produced and distributed in Italy",
      "Carbon intensity":0.85,
      "industry":"Food & Beverage"
  },
  {
      "name":"Pasta produced in Italy (for export)",
      "description":"Durum wheat semolina dried Pasta made by durum semolina and water, with an humidity content of about 13%. It is produced in Italy and distributed all over the world.",
      "Carbon intensity":1.03,
      "industry":"Food & Staples Retailing"
  },
  {
      "name":"Pasta produced in Italy (for export)",
      "description":"Durum wheat semolina dried Pasta made by durum semolina and water, with an humidity content of about 13%. It is produced in Italy and distributed all over the world.",
      "Carbon intensity":0.89,
      "industry":"Food & Beverage"
  },
  {
      "name":"Pasta produced in Greece",
      "description":"Durum wheat semolina dried Pasta made by durum semolina and water, with an humidity content of about 13%. It is produced and distributed in Greece.",
      "Carbon intensity":1.67,
      "industry":"Food & Staples Retailing"
  },
  {
      "name":"Pasta produced in Greece",
      "description":"Durum wheat semolina dried Pasta made by durum semolina and water, with an humidity content of about 13%. It is produced and distributed in Greece.",
      "Carbon intensity":1.7,
      "industry":"Food & Beverage"
  },
  {
      "name":"Pasta produced in Turkey",
      "description":"Durum wheat semolina dried Pasta made by durum semolina and water, with an humidity content of about 13%. It is produced and distributed in Turkey.",
      "Carbon intensity":0.93,
      "industry":"Food & Staples Retailing"
  },
  {
      "name":"Pasta produced in Turkey",
      "description":"Durum wheat semolina dried Pasta made by durum semolina and water, with an humidity content of about 13%. It is produced and distributed in Turkey.",
      "Carbon intensity":0.94,
      "industry":"Food & Beverage"
  },
  {
      "name":"Crisp\u00c2\u0092n light 7 grains",
      "description":"Crackerbreads,branded Wasa, produced in Germany and sold in the United States.",
      "Carbon intensity":1.29,
      "industry":"Food & Staples Retailing"
  },
  {
      "name":"Crisp\u00c2\u0092n light 7 grains",
      "description":"Crackerbreads,branded Wasa, produced in Germany and sold in the United States.",
      "Carbon intensity":1.51,
      "industry":"Food & Beverage"
  },
  {
      "name":"Light rye",
      "description":"Crispbread, branded Wasa, produced in Germany and sold in the United States.",
      "Carbon intensity":1.17,
      "industry":"Food & Staples Retailing"
  },
  {
      "name":"Light rye",
      "description":"Crispbread, branded Wasa, produced in Germany and sold in the United States.",
      "Carbon intensity":1.35,
      "industry":"Food & Beverage"
  },
  {
      "name":"Light Rye",
      "description":"Crispbread, branded Wasa, produced in Germany and sold in the United States.",
      "Carbon intensity":1.43,
      "industry":"Food & Staples Retailing"
  },
  {
      "name":"Multi grain",
      "description":"Crispbread, branded Wasa, produced in Germany and sold in the United States",
      "Carbon intensity":1.17,
      "industry":"Food & Staples Retailing"
  },
  {
      "name":"Multi grain",
      "description":"Crispbread, branded Wasa, produced in Germany and sold in the United States",
      "Carbon intensity":4.49,
      "industry":"Food & Beverage"
  },
  {
      "name":"Multi Grain",
      "description":"Crispbread, branded Wasa, produced in Germany and sold in the United States",
      "Carbon intensity":1.24,
      "industry":"Food & Staples Retailing"
  },
  {
      "name":"Durum wheat semolina pasta in paperboard box (produced in United States)",
      "description":"Dry semolina pasta is made from durum wheat and water and is produced by extrusion or lamination and then a drying process.The pasta production process does not require additives and preservatives:it is the drying process that guarantees the conservation.",
      "Carbon intensity":1.33,
      "industry":"Food & Staples Retailing"
  },
  {
      "name":"5 oz can whitemeat tuna",
      "description":"Field not included in 2013 data",
      "Carbon intensity":3.8,
      "industry":"Food Products"
  },
  {
      "name":"5 oz can lightmeat tuna",
      "description":"Field not included in 2013 data",
      "Carbon intensity":2.18,
      "industry":"Food Products"
  },
  {
      "name":"This is the average footprint of the 31 products we provided Walmart in 2012. The unit is in kg CO2e\/tonne of product.",
      "description":"This is the average footprint of the 31 products we provided Walmart in 2012. The unit is in kg CO2e\/tonne of product.",
      "Carbon intensity":1.36,
      "industry":"Food Products"
  },
  {
      "name":"Average SKU",
      "description":"Average SKU sold to Walmart in 2013",
      "Carbon intensity":1.36,
      "industry":"Food Products"
  },
  {
      "name":"Finished cold rolled coil",
      "description":"Finished cold rolled coil",
      "Carbon intensity":1.1,
      "industry":"Metals & Mining"
  },
  {
      "name":"Hot Dip Galvanised Coil",
      "description":"Hot Dip Galvanised Coil",
      "Carbon intensity":1.2,
      "industry":"Metals & Mining"
  },
  {
      "name":"Hot rolled coil",
      "description":"Hot rolled coil",
      "Carbon intensity":1.05,
      "industry":"Metals & Mining"
  },
  {
      "name":"HON-DASHI(R)",
      "description":"Manufacture of basic dried bonito flake ingredients (seasoning)",
      "Carbon intensity":14.08,
      "industry":"Beverages"
  },
  {
      "name":"Knorr(R) Cup Soup Tsubu Tappuri Corn Cream",
      "description":"Freeze-dried soup",
      "Carbon intensity":7.1,
      "industry":"Beverages"
  },
  {
      "name":"L-Lysine Monohydrochloride(For Feed)",
      "description":"Nutritional reinforcement goods for stockbreeding feed. Essential amino-acid.",
      "Carbon intensity":5.2,
      "industry":"Food & Beverage"
  },
  {
      "name":"L-Lysine Monohydrochloride(For Feed)",
      "description":"Feed-use amino acid Nutritional reinforcement goods for stockbreeding feed. Essential amino-acid.",
      "Carbon intensity":5.2,
      "industry":"Beverages"
  },
  {
      "name":"L-Arginine",
      "description":"Amino acid for food additives",
      "Carbon intensity":15.05,
      "industry":"Beverages"
  },
  {
      "name":"Lemon and Basil Fried Chicken",
      "description":"Frozen foods",
      "Carbon intensity":5.87,
      "industry":"Beverages"
  },
  {
      "name":"L-Glutamine",
      "description":"Amino acid for food additives",
      "Carbon intensity":12.76,
      "industry":"Beverages"
  },
  {
      "name":"L-Isoleucine",
      "description":"Amino acid for food additives",
      "Carbon intensity":21.65,
      "industry":"Beverages"
  },
  {
      "name":"L-leucine",
      "description":"Amino acid for food additives",
      "Carbon intensity":29.25,
      "industry":"Beverages"
  },
  {
      "name":"L-Valine",
      "description":"Amino acid for food additives",
      "Carbon intensity":19.65,
      "industry":"Beverages"
  },
  {
      "name":"Masako Ayam",
      "description":"Indonesian dried seasoning",
      "Carbon intensity":2.73,
      "industry":"Beverages"
  },
  {
      "name":"Mentsuyu",
      "description":"Liquid seasoning",
      "Carbon intensity":2.53,
      "industry":"Beverages"
  },
  {
      "name":"Monosodium L-Glutamate",
      "description":"Amino acid for food additives",
      "Carbon intensity":2.9,
      "industry":"Beverages"
  },
  {
      "name":"Nabe Cube(R) Toridashi Umashio",
      "description":"Cubed seasoning",
      "Carbon intensity":8.62,
      "industry":"Beverages"
  },
  {
      "name":"AGF Blendy Stick Cafe au Lait",
      "description":"Coffee mixes",
      "Carbon intensity":0.21,
      "industry":"Beverages"
  },
  {
      "name":"Rosdee Pork",
      "description":"Thai dried seasoning",
      "Carbon intensity":3.2,
      "industry":"Beverages"
  },
  {
      "name":"Aji-ngon Pork",
      "description":"Vietnamese dried seasoning",
      "Carbon intensity":0.37,
      "industry":"Beverages"
  },
  {
      "name":"Ajinomoto KK Consomme(Granules)",
      "description":"Granules tiped Consomme seasoning",
      "Carbon intensity":6.82,
      "industry":"Beverages"
  },
  {
      "name":"Ajinomoto KK Shirogayu 250g",
      "description":"Retort-pouched rice foods",
      "Carbon intensity":0.8,
      "industry":"Beverages"
  },
  {
      "name":"Aspartame",
      "description":"Sweetner made from amino acids",
      "Carbon intensity":31.2,
      "industry":"Beverages"
  },
  {
      "name":"Cook Do(R) Hoikoro",
      "description":"Chinese taste liquid-based seasoning",
      "Carbon intensity":3.0,
      "industry":"Beverages"
  },
  {
      "name":"Cook Do(R) kyo-no Ozara Butabara Daikon",
      "description":"Japanese taste liquid-based seasoning",
      "Carbon intensity":2.3,
      "industry":"Beverages"
  },
  {
      "name":"Di-sodium 5'-Inosinate",
      "description":"Kind of nucleic acid for food additives",
      "Carbon intensity":12.92,
      "industry":"Beverages"
  },
  {
      "name":"Diced tomato",
      "description":"Diced tomato is produced from fresh tomato specially selected for this product in the fields and by color sorting and selection by labour.Tomato is cut in dices and blended with a juice to get the requested brix",
      "Carbon intensity":0.71,
      "industry":"Food Products"
  },
  {
      "name":"Tomato fibre",
      "description":null,
      "Carbon intensity":0.5,
      "industry":"Food Products"
  },
  {
      "name":"Tomato paste",
      "description":"Tomato paste is produced from fresh tomato unloaded, crushed,passing through pulper finisher to remove skins and sedes, evaporated using vacuum and temperatura sterilized and packed in asseptic bags",
      "Carbon intensity":0.65,
      "industry":"Food Products"
  },
  {
      "name":"Tomato powder",
      "description":"Tomato powder is produced in crop time from fresh tomato after having the skin and seeds removed after going through the pulper finisher.After crop time it is produced from tomato paste concentarted and pasteurized.Drying operation is done by a spray dryer",
      "Carbon intensity":0.65,
      "industry":"Food Products"
  },
  {
      "name":"Peppermint tea infusion",
      "description":"peppermint Infusion per Cup (= 2gram)",
      "Carbon intensity":10.21,
      "industry":"Food Products"
  },
  {
      "name":"Peppermint tea infusion",
      "description":"Peppermint Infusion per Cup = 2gram",
      "Carbon intensity":10.21,
      "industry":"Food Products"
  },
  {
      "name":"PET preforms",
      "description":"PET Preforms",
      "Carbon intensity":0.87,
      "industry":"Packaging for consumer goods"
  },
  {
      "name":"Cable of LMR-195-LLPL",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.98,
      "industry":"Electrical Equipment"
  },
  {
      "name":"Cable",
      "description":"LMR-195-LLPL",
      "Carbon intensity":0.85,
      "industry":"Electrical Equipment"
  },
  {
      "name":"Cable",
      "description":"Coaxial Cable and Cable assembly  LMR-195-LLPL",
      "Carbon intensity":0.77,
      "industry":"Comm. equipm. & capital goods"
  },
  {
      "name":"Float Table Top & Base",
      "description":"Float is a revolutionary standing office desk that brings effortless operation to traditional sit-stand products. Ease of use is at the heart of Float, as it seamlessly adjusts between sitting and standing postures without interrupting workflow.  The Float Table achieved Living Product Challenge certification in 2016.",
      "Carbon intensity":0.67,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Smart Chair",
      "description":"The Diffrient Smart chair is an intelligent mesh task chair with a striking linear aesthetic that complements any environment. Engineered to provide automatic lumbar support for every user, as well as simplicity and ease of use, Diffrient Smart offers comfort, style and flexibility. The Smart Chair achieved Living Product Challenge certification in 2016.",
      "Carbon intensity":2.03,
      "industry":"Commercial Services & Supplies"
  },
  {
      "name":"Residential Air Conditioner",
      "description":"Field not included in 2013 data",
      "Carbon intensity":209.18,
      "industry":"Electrical Equipment"
  },
  {
      "name":"Residential Air Conditioner",
      "description":"Based on Daikin standards for 2.8-kW class residential air conditioners. The seasonal power consumption is calculated in accordance with the standard of the Japanese Industrial Standards (JIS).",
      "Carbon intensity":200.71,
      "industry":"Building Products"
  },
  {
      "name":"Residential Air Conditioner",
      "description":"Based on Daikin standards for 2.8-kW class residential air conditioners. The seasonal power consumption is calculated in accordance with the standard of the Japanese Industrial Standards (JIS).",
      "Carbon intensity":200.71,
      "industry":"Electrical Equipment"
  },
  {
      "name":"Residential Air Conditioner",
      "description":"The air-conditioner for residence",
      "Carbon intensity":241.53,
      "industry":"Building Products"
  },
  {
      "name":"Commercial Air Conditioner",
      "description":"The air-conditioner for office building.",
      "Carbon intensity":341.16,
      "industry":"Building Products"
  },
  {
      "name":"Light commercial Air Conditioner",
      "description":"The air-conditioner for store building",
      "Carbon intensity":308.9,
      "industry":"Building Products"
  },
  {
      "name":"Mercedes-Benz CLS-Class",
      "description":"Passenger Car",
      "Carbon intensity":31.9,
      "industry":"Automobiles & components"
  },
  {
      "name":"Mercedes-Benz E-Class BlueTEC Hybrid",
      "description":"Passenger Car",
      "Carbon intensity":23.4,
      "industry":"Automobiles & components"
  },
  {
      "name":"Mercedes-Benz A-Class",
      "description":"Passenger Car",
      "Carbon intensity":21.4,
      "industry":"Automobiles & components"
  },
  {
      "name":"Mercedes-Benz GLA-Class",
      "description":"Passenger Car",
      "Carbon intensity":20.52,
      "industry":"Automobiles & components"
  },
  {
      "name":"Mercedes-Benz GLK-Class",
      "description":"Passenger Car",
      "Carbon intensity":26.38,
      "industry":"Automobiles & components"
  },
  {
      "name":"Mercedes-Benz SL-Class",
      "description":"Passenger Car",
      "Carbon intensity":39.88,
      "industry":"Automobiles & components"
  },
  {
      "name":"Mercedes-Benz A-Class (A 180 BlueEFFICIENCY)",
      "description":"Passenger Car",
      "Carbon intensity":26.67,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz B-Class (B 180 BlueEFFICIENCY)",
      "description":"Passenger Car",
      "Carbon intensity":28.33,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz B-Class Electric Drive (B 250 e)",
      "description":"Passengercar, B 250 e, electricity from hydro power",
      "Carbon intensity":7.27,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz C-Class (C 180)",
      "description":"Passenger Car",
      "Carbon intensity":25.71,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz C-Class (C 250)",
      "description":"Passenger Car",
      "Carbon intensity":21.67,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz C-Class Plug-In Hybrid (C 350 e)",
      "description":"Passengercar, C 350 e, electricity from hydro power",
      "Carbon intensity":12.47,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz CLA (CLA 180)",
      "description":"Passenger Car",
      "Carbon intensity":25.83,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz B-Class",
      "description":"Passenger Car",
      "Carbon intensity":22.81,
      "industry":"Automobiles & components"
  },
  {
      "name":"Mercedes-Benz CLS (350 BlueEFFICIENCY)",
      "description":"Passenger Car",
      "Carbon intensity":27.03,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz E-Class (E 200)",
      "description":"Passenger Car",
      "Carbon intensity":33.33,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz E-Class (E 220 d (Estate))",
      "description":"Passenger Car",
      "Carbon intensity":17.67,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz E-Class (E 220 d)",
      "description":"Passenger Car",
      "Carbon intensity":18.1,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz E-Class Plug-In Hybrid (E 350 e)",
      "description":"Passengercar, E 350 e, electricity from hydro power",
      "Carbon intensity":13.51,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz GLA (GLA 200)",
      "description":"Passenger Car",
      "Carbon intensity":23.57,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz GLC (220 d 4MATIC)",
      "description":"Passenger Car",
      "Carbon intensity":15.6,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz GLC Plug-In Hybrid (GLC 350 e 4MATIC)",
      "description":"Passengercar, GLC 350 e 4MATIC, electricity from hydro power",
      "Carbon intensity":13.5,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz GLE (GLE 500 4MATIC)",
      "description":"Passenger Car",
      "Carbon intensity":26.0,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz GLE Plug-In Hybrid - GLE 500 e 4MATIC",
      "description":"Passengercar, GLE 500 e 4MATIC, electricity from hydro power",
      "Carbon intensity":11.14,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz C-Class",
      "description":"Passenger Car",
      "Carbon intensity":33.55,
      "industry":"Automobiles & components"
  },
  {
      "name":"Mercedes-Benz S-Class (S 500)",
      "description":"Passenger Car",
      "Carbon intensity":41.46,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz S-Class Hybrid (S 300 BlueTEC HYBRID)",
      "description":"Passenger Car",
      "Carbon intensity":18.78,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz S-Class Hybrid (S 400 h)",
      "description":"Passenger Car",
      "Carbon intensity":25.43,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz S-Class Plug-In Hybrid (S 500 e)",
      "description":"Passengercar, S 500 e, electricity from hydro power",
      "Carbon intensity":14.7,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz SL (SL 350)",
      "description":null,
      "Carbon intensity":34.87,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz SLC (SLK 200 BlueEFFICIENCY)",
      "description":null,
      "Carbon intensity":22.33,
      "industry":"Auto Components"
  },
  {
      "name":"Mercedes-Benz C-Class e",
      "description":"Passenger Car",
      "Carbon intensity":17.34,
      "industry":"Automobiles & components"
  },
  {
      "name":"Mercedes-Benz E-Class Saloon",
      "description":"Passenger Car",
      "Carbon intensity":28.1,
      "industry":"Automobiles & components"
  },
  {
      "name":"Mercedes-Benz M-Class - Passenger Car",
      "description":"BLANK",
      "Carbon intensity":20.66,
      "industry":"Automobiles & components"
  },
  {
      "name":"Mercedes-Benz S-Class",
      "description":"Passenger Car",
      "Carbon intensity":26.8,
      "industry":"Automobiles & components"
  },
  {
      "name":"Mercedes-Benz B-Class electric drive",
      "description":"Passenger Car",
      "Carbon intensity":13.1,
      "industry":"Automobiles & components"
  },
  {
      "name":"Mercedes-Benz CLA-Class",
      "description":"Passenger Car",
      "Carbon intensity":20.13,
      "industry":"Automobiles & components"
  },
  {
      "name":"Set yoghourt",
      "description":"Field not included in 2013 data",
      "Carbon intensity":1.53,
      "industry":"Food Products"
  },
  {
      "name":"Drink yoghourt",
      "description":"Field not included in 2013 data",
      "Carbon intensity":1.3,
      "industry":"Food Products"
  },
  {
      "name":"Plain Water (SKU: Bonafont 1L film bottle)",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.17,
      "industry":"Food Products"
  },
  {
      "name":"BONAFONT NATURAL 6000 ML X2 FILM 84 (6L RPET Bottle)_54742",
      "description":"Plain water bottle of a 6 liters capacity produced and sold in Mexico. The bottle is made of 100% rPET. top SKU of Bonafont volumes sold to Walmart. represent 9% of the volumes.",
      "Carbon intensity":0.15,
      "industry":"Food & Beverage"
  },
  {
      "name":"DANONE MPCK STRAWBERRY 1960G (8X245G)_87121",
      "description":"ABA Strawberry drink yoghourt produced and sold in Mexico. A consumer unit contains 245g. This SKU contains 8 pack; top SKU of Danone Mexico volumes sold to Walmart. represent 7% of the volumes.",
      "Carbon intensity":2.28,
      "industry":"Food & Beverage"
  },
  {
      "name":"SILHOUETTE ST\/PE\/RA\/BL 100GX16_14967",
      "description":"Silhouette stirred yoghouort produced and sold in Canada. A consumer unit contains 100g. This SKU contains 16 pots. top SKU of Danone canada volumes sold to Walmart. represent 4% of the volumes.",
      "Carbon intensity":1.26,
      "industry":"Food & Beverage"
  },
  {
      "name":"Activia STR\/PCH\/BLU 24X4OZ CLUB_67740",
      "description":"Activia Strawberry\/ Peach \/Blueberry stirred yoghourt produced and sold in the US. A consumer unit contains 113,4g.This reference is sold by 24. top SKU of Danone US volumes sold to Walmart. represent 3% of the volumes.",
      "Carbon intensity":2.25,
      "industry":"Food & Beverage"
  },
  {
      "name":"Argon",
      "description":"Argon gas (cylinders)",
      "Carbon intensity":0.32,
      "industry":"Chemicals"
  },
  {
      "name":"Nitrogen",
      "description":"Nitrogen gas(cylinders)",
      "Carbon intensity":0.4,
      "industry":"Chemicals"
  },
  {
      "name":"Keyboards",
      "description":"Keyboards",
      "Carbon intensity":23.39,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Keyboard",
      "description":"NB Keyboard",
      "Carbon intensity":5.63,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"DC fan",
      "description":"1.DC fan used as a cooling component in computers, servers or similar equipment 2.B2B product.",
      "Carbon intensity":7.15,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"External power supply\/ portable adaptor",
      "description":"1.External power supply\/portable adaptor   2.Including its packaging materials (i.e. PE bag and carton)  3.B2B product.",
      "Carbon intensity":21.76,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"PV Inverter",
      "description":"1.An inverter to transfer AC power to DC power   2.B2B product",
      "Carbon intensity":8.38,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"TPS (Telecom Power System)",
      "description":"1.External power supply power.2.B2B product.3.Delta had finished the inventory of product carbon footprint for TPS. 4.TPS product was assured by TUV.",
      "Carbon intensity":16.94,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Latitude E6440",
      "description":"Commerical Laptop",
      "Carbon intensity":164.15,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Latitude E6540",
      "description":"Commercial Laptop",
      "Carbon intensity":159.38,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"The Latitude E6400 is a typical high-volume, mainstream business laptop that is representative of a range of similar laptop  products. It is Energy Star\u00c2\u00ae 5.0 qualified and EPEAT Gold registered.",
      "description":"The Latitude E6400 is a typical high-volume, mainstream business laptop that is representative of a range of similar laptop  products. It is Energy Star\u00c2\u00ae 5.0 qualified and EPEAT Gold registered.",
      "Carbon intensity":138.89,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Latitude E7240",
      "description":"Commerical Laptop",
      "Carbon intensity":227.94,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Latitude E7440",
      "description":"Commerical Laptop",
      "Carbon intensity":169.33,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"OptiPlex 3030 all-in-one",
      "description":"Commerical Desktop",
      "Carbon intensity":68.28,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"The OptiPlex 780 Mini Tower is a typical high-volume, mainstream business desktop that is representative of a range of similar desktop products. It is Energy Star\u00c2\u00ae 5.0 compliant and EPEAT Gold registered.",
      "description":"The OptiPlex 780 Mini Tower is a typical high-volume, mainstream business desktop that is representative of a range of similar desktop products. It is Energy Star\u00c2\u00ae 5.0 compliant and EPEAT Gold registered.",
      "Carbon intensity":68.38,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"PowerEdge R710 is a typical high-volume, next-generation Intel Xeon processor-based 2U Rack Server that is representative of a range of similar server products.",
      "description":"PowerEdge R710 is a typical high-volume, next-generation Intel Xeon processor-based 2U Rack Server that is representative of a range of similar server products.",
      "Carbon intensity":243.68,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"PowerEdge R710",
      "description":"Server",
      "Carbon intensity":243.68,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"OptiPlex 3010 Minitower (MT)",
      "description":"Commercial Desktop",
      "Carbon intensity":109.47,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"OptiPlex 9010 Small Form Factor (SFF)",
      "description":"Commercial Desktop",
      "Carbon intensity":111.17,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Latitude E3440",
      "description":"Commercial Laptop",
      "Carbon intensity":157.0,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Latitude E3540",
      "description":"Commercial Laptop",
      "Carbon intensity":139.19,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Latitude E5440",
      "description":"Commerical Laptop",
      "Carbon intensity":146.0,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Latitude E5540",
      "description":"Commerical Laptop",
      "Carbon intensity":135.22,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Average of all products sold to Braskem",
      "description":"Field not included in 2013 data",
      "Carbon intensity":5.5,
      "industry":"Chemicals"
  },
  {
      "name":"Average of all products sold to Braskem",
      "description":"Products sold to Braskem",
      "Carbon intensity":5.5,
      "industry":"Chemicals"
  },
  {
      "name":"Average of all products sold to Braskem",
      "description":"Products sold to Braskem",
      "Carbon intensity":6.5,
      "industry":"Chemicals"
  },
  {
      "name":"Average of all products sold to Braskem",
      "description":"Products sold to Braskem",
      "Carbon intensity":6.24,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated Global Sales for KAO",
      "description":"Amines, polyacrylates and other products",
      "Carbon intensity":3.1,
      "industry":"Chemicals"
  },
  {
      "name":"Beverage can inside spray lacquer steel - Aqualure 905",
      "description":"Beverage can inside spray lacquer steel - Aqualure 905",
      "Carbon intensity":2.0,
      "industry":"Chemicals"
  },
  {
      "name":"Beverage can inside spray lacquer steel",
      "description":"Aqualure 905",
      "Carbon intensity":2.0,
      "industry":"Chemicals"
  },
  {
      "name":"Average of all products sold to KAO",
      "description":"Peroxides",
      "Carbon intensity":4.9,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated Global Sales for Customer CNH Industrial NV",
      "description":"An average powder coating",
      "Carbon intensity":4.7,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated global sales for Dell Inc",
      "description":"The information has been calculated with an average of all products sold to Dell Inc. Our main product groups are being updated at the moment and we will be able to provide more accurate information in the near future.",
      "Carbon intensity":1.32,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated sales to Symrise",
      "description":"Sodium Salt, different products",
      "Carbon intensity":0.14,
      "industry":"Chemicals"
  },
  {
      "name":"Caustic products delivered to ICL",
      "description":"Caustic solution",
      "Carbon intensity":0.44,
      "industry":"Chemicals"
  },
  {
      "name":"Chelates and Micronutrients sold to ICL",
      "description":"chelates and Micronutrients",
      "Carbon intensity":2.85,
      "industry":"Chemicals"
  },
  {
      "name":"Chlormethane products delivered to ICL",
      "description":"Chloromethanes",
      "Carbon intensity":1.8,
      "industry":"Chemicals"
  },
  {
      "name":"Beverage can inside spray lacquer aluminium - Aqualure 900, Aqualure 2000 etc.",
      "description":"Beverage can inside spray lacquer aluminium - Aqualure 900, Aqualure 2000 etc.",
      "Carbon intensity":1.6,
      "industry":"Chemicals"
  },
  {
      "name":"Beverage can inside spray lacquer aluminium",
      "description":"Aqualure 900, Aqualure 2000 etc.",
      "Carbon intensity":1.6,
      "industry":"Chemicals"
  },
  {
      "name":"Beverage can inside spray lacquer aluminium",
      "description":"Aqualure 900, Aqualure 2000 etc.",
      "Carbon intensity":1.6,
      "industry":"Chemicals"
  },
  {
      "name":"Overprint varnishes  (also used to approximate rim varnishes)",
      "description":"Overprint varnishes  (also used to approximate rim varnishes)",
      "Carbon intensity":2.2,
      "industry":"Chemicals"
  },
  {
      "name":"Overprint varnishes",
      "description":"Overprint varnishes (also used to approximate rim varnishes)",
      "Carbon intensity":2.2,
      "industry":"Chemicals"
  },
  {
      "name":"Overprint varnishes",
      "description":"Overprint varnishes (also used to approximate rim varnishes)",
      "Carbon intensity":2.2,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated Global Sales for Unilever - Polyacrylates and other products",
      "description":"Aggregated Global Sales for Unilever - Polyacrylates and other products",
      "Carbon intensity":3.0,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated Global Sales for Unilever",
      "description":"Polyacrylates and other products",
      "Carbon intensity":3.42,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated Global Sales for Unilever",
      "description":"Polyacrylates and other products",
      "Carbon intensity":2.58,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated Global Sales for Unilever",
      "description":"Polyacrylates and other products",
      "Carbon intensity":2.54,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated Global Sales for L'Oreal - Polyacrylates and other products",
      "description":"Aggregated Global Sales for L'Oreal - Polyacrylates and other products",
      "Carbon intensity":2.2,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated Global Sales for L'Oreal",
      "description":"Polyacrylates and other products",
      "Carbon intensity":3.01,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated Global Sales for L'Oreal",
      "description":"Polyacrylates and other products",
      "Carbon intensity":2.76,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated Global Sales for L'Oreal",
      "description":"Polyacrylates and other products",
      "Carbon intensity":2.69,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated Global Sales for Johnson & Johnson - Polyacrylates and other products",
      "description":"Aggregated Global Sales for Johnson & Johnson - Polyacrylates and other products",
      "Carbon intensity":2.0,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated Global Sales for Johnson & Johnson",
      "description":"Polyacrylates and other products",
      "Carbon intensity":3.4,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated Global Sales for Johnson & Johnson",
      "description":"Polyacrylates and other products",
      "Carbon intensity":2.91,
      "industry":"Chemicals"
  },
  {
      "name":"Aggregated Global Sales for Johnson & Johnson",
      "description":"Polyacrylates and other products",
      "Carbon intensity":3.56,
      "industry":"Chemicals"
  },
  {
      "name":"Sodium chlorate produced in North America.",
      "description":"Field not included in 2013 data",
      "Carbon intensity":1.2,
      "industry":"Chemicals"
  },
  {
      "name":"Sodium chlorate as solid phase, produced in South America.",
      "description":"Sodium chlorate as solid phase, produced in South America.",
      "Carbon intensity":0.22,
      "industry":"Chemicals"
  },
  {
      "name":"Chlorine dioxide water solution produced in South America.",
      "description":"Chlorine dioxide water solution produced in South America.",
      "Carbon intensity":0.85,
      "industry":"Chemicals"
  },
  {
      "name":"Extra Neutral Potable Ethanol 96.4%",
      "description":"Field not included in 2013 data",
      "Carbon intensity":1.94,
      "industry":"Beverages"
  },
  {
      "name":"Extra Neutral Potable Ethanol 96.4%",
      "description":"Potable Grade Ethanol",
      "Carbon intensity":1.23,
      "industry":"Beverages"
  },
  {
      "name":"Malt non HDP",
      "description":"metric tonne",
      "Carbon intensity":0.6,
      "industry":"Food & Staples Retailing"
  },
  {
      "name":"Malted barley",
      "description":"Manufacture of malted barley including the data from embedded carbon from growing",
      "Carbon intensity":0.52,
      "industry":"Food & Beverage"
  },
  {
      "name":"Malted Barley",
      "description":"Provision of bulk malt for brewing, distilling or food use",
      "Carbon intensity":0.56,
      "industry":"Beverages"
  },
  {
      "name":"Malt extract",
      "description":"Provision of liquid malt extract for brewing, distilling or food use",
      "Carbon intensity":0.95,
      "industry":"Beverages"
  },
  {
      "name":"Malt flour in sack",
      "description":"Provision of liquid malt extract for brewing, distilling or food use",
      "Carbon intensity":0.6,
      "industry":"Beverages"
  },
  {
      "name":"Unmalted barley at harvest",
      "description":"Farm grown malting barley",
      "Carbon intensity":0.24,
      "industry":"Beverages"
  },
  {
      "name":"H10311 - La vie est belle",
      "description":"Glass bottle for perfumery",
      "Carbon intensity":2.67,
      "industry":"Containers & Packaging"
  },
  {
      "name":"H4953 - Armani IO 100 ml",
      "description":"Glass bottle for perfumery",
      "Carbon intensity":2.72,
      "industry":"Containers & Packaging"
  },
  {
      "name":"H000 (Set-top Box)",
      "description":"[Initial model\u00c2\u0092s Life cycle assessment result] -Material acquisition and pre-processing Stage: 7.622 kgCO2eq\/EA (9.85%) -Production Stage: 1.310 kgCO2eq\/EA (1.69%) -Distribution and storage Stage: 0.164 kgCO2eq\/EA (0.21%) -Use Stage: 68.133 kgCO2eq\/EA (88.06%) -End of Life Stage: 0.141 kgCO2eq\/EA (0.18%) -Total: 7.622 kgCO2eq\/EA (100%) -Weight: 1988.04g  [Derivative model\u00c2\u0092s Life cycle assessment result] -Material acquisition and pre-processing Stage: 4.633 kgCO2eq\/EA (11.70%) -Production Stage: 0.635 kgCO2eq\/EA (1.60%) -Distribution and storage Stage: 0.105 kgCO2eq\/EA (0.26%) -Use Stage: 34.114 kgCO2eq\/EA (86.16%) -End of Life Stage: 0.108 kgCO2eq\/EA (0.27%) -Total: 39.594 kgCO2eq\/EA (100%) -Weight: 1270.84",
      "Carbon intensity":39.83,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Tire",
      "description":"Tire",
      "Carbon intensity":8.34,
      "industry":"Auto Components"
  },
  {
      "name":"Corrugated box average Corrugated box Sab miller",
      "description":"Field not included in 2013 data",
      "Carbon intensity":1.16,
      "industry":"Containers & Packaging"
  },
  {
      "name":"metal crown caps",
      "description":"Field not included in 2013 data",
      "Carbon intensity":0.17,
      "industry":"Beverages"
  },
  {
      "name":"Crown caps",
      "description":"0,18 mm metal crown caps",
      "Carbon intensity":0.18,
      "industry":"Beverages"
  },
  {
      "name":"Sodium sulbactam 3",
      "description":"Field not included in 2013 data",
      "Carbon intensity":70.0,
      "industry":"Chemicals"
  },
  {
      "name":"cyanodiester",
      "description":"Field not included in 2013 data",
      "Carbon intensity":6.0,
      "industry":"Chemicals"
  },
  {
      "name":"480ml Bottle",
      "description":"480ml Bottle for contact lenses solutions",
      "Carbon intensity":1.46,
      "industry":"Containers & Packaging"
  },
  {
      "name":"18mm Cap",
      "description":"18mm Cap for contact lenses solutions' bottle",
      "Carbon intensity":0.23,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Fajar Board",
      "description":"1 side Coated Duplex Board - Grey Back",
      "Carbon intensity":0.72,
      "industry":"Containers & Packaging"
  },
  {
      "name":"Stevia Sweeteners",
      "description":"Field not included in 2013 data",
      "Carbon intensity":65.71,
      "industry":"Food Products"
  },
  {
      "name":"Stevia Sweetener",
      "description":"Field not included in 2013 data",
      "Carbon intensity":47.51,
      "industry":"Food Products"
  },
  {
      "name":"Natural Flavors",
      "description":"Field not included in 2013 data",
      "Carbon intensity":45.81,
      "industry":"Food Products"
  },
  {
      "name":"Stevia Sweeteners",
      "description":"Field not included in 2013 data",
      "Carbon intensity":74.64,
      "industry":"Food Products"
  },
  {
      "name":"Tobacco",
      "description":"Tobacco [incl. cradle to gate (green tobacco) and subsequent processing]",
      "Carbon intensity":0.7,
      "industry":"Food & Beverage"
  },
  {
      "name":"Semi-finished aluminum sheet (hot rolled products)",
      "description":"Coils of hot rolled aluminum sheet delivered to customers",
      "Carbon intensity":3.94,
      "industry":"Metals & Mining"
  },
  {
      "name":"Semi-finished aluminum sheet (hot rolled products)",
      "description":"Coils of hot rolled aluminum sheet delivered to customers",
      "Carbon intensity":0.41,
      "industry":"Metals & Mining"
  },
  {
      "name":"Semi-finished aluminum sheet (cold rolled products)",
      "description":"Coils of cold rolled aluminum sheet delivered to customers",
      "Carbon intensity":5.34,
      "industry":"Metals & Mining"
  },
  {
      "name":"Semi-finished aluminum sheet (cold rolled products)",
      "description":"Coils of cold rolled aluminum sheet delivered to customers",
      "Carbon intensity":0.41,
      "industry":"Metals & Mining"
  },
  {
      "name":"Alumina",
      "description":"Alumina produced for customers",
      "Carbon intensity":2.22,
      "industry":"Metals & Mining"
  },
  {
      "name":"Primary aluminum ingot",
      "description":"Aluminum ingots delivered to customers",
      "Carbon intensity":6.51,
      "industry":"Metals & Mining"
  },
  {
      "name":"Cast aluminum products",
      "description":"Cast aluminum products to customers",
      "Carbon intensity":0.72,
      "industry":"Metals & Mining"
  },
  {
      "name":"kettle",
      "description":"glass kettle",
      "Carbon intensity":38.46,
      "industry":"Household Durables"
  },
  {
      "name":"aluminium wheel",
      "description":"aluminium wheel",
      "Carbon intensity":2.92,
      "industry":"Electrical Equipment"
  },
  {
      "name":"Vaccum Cleaners (Canisters & Uprights)",
      "description":"Field not included in 2013 data",
      "Carbon intensity":63.91,
      "industry":"Household Durables"
  },
  {
      "name":"Vaccum Cleaners",
      "description":"Canisters & Uprights",
      "Carbon intensity":63.91,
      "industry":"Household Durables"
  },
  {
      "name":"Vaccum Cleaners",
      "description":"Canisters & Uprights",
      "Carbon intensity":63.91,
      "industry":"Home durables, textiles, & equipment"
  },
  {
      "name":"Notebook (Classmate PC) E11IS is manufactured & designed by ECS's factory located in eastern China, its GHG emission inventoried in 2012 by methodology of PAS 2050:2011 and verified by SGS ready.",
      "description":"Notebook (Classmate PC) E11IS is manufactured & designed by ECS's factory located in eastern China, its GHG emission inventoried in 2012 by methodology of PAS 2050:2011 and verified by SGS ready.",
      "Carbon intensity":163.98,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"30L desktop model vBeijing2_I for design stage plus manufacturing stage, made by ECS's factory loacted in southern China (GHG emission inventoried in 2012 by methodology of ISO 14064-1 and allocation basis by weight)",
      "description":"30L desktop model vBeijing2_I for design stage plus manufacturing stage, made by ECS's factory loacted in southern China (GHG emission inventoried in 2012 by methodology of ISO 14064-1 and allocation basis by weight)",
      "Carbon intensity":0.18,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Beedwire 0.96",
      "description":"bronze coated steel wire",
      "Carbon intensity":1.12,
      "industry":"Auto Components"
  },
  {
      "name":"Beedwire 1.27",
      "description":"bronze coated steel wire",
      "Carbon intensity":0.99,
      "industry":"Auto Components"
  },
  {
      "name":"S3840cdn",
      "description":"Color Smart Printer",
      "Carbon intensity":88.46,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"S3845cdn",
      "description":"Color Smart Multifunction Printer",
      "Carbon intensity":72.73,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"C1760nw Perinter",
      "description":"Field not included in 2013 data",
      "Carbon intensity":37.77,
      "industry":"Office Electronics"
  },
  {
      "name":"2150cdn  printer",
      "description":"Field not included in 2013 data",
      "Carbon intensity":23.88,
      "industry":"Office Electronics"
  },
  {
      "name":"C2660dn",
      "description":"Color Laser Printer",
      "Carbon intensity":54.69,
      "industry":"Office Electronics"
  },
  {
      "name":"C2660dn",
      "description":"Color Laser Printer",
      "Carbon intensity":54.69,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"C2660dn",
      "description":"Color Laser Printer",
      "Carbon intensity":54.69,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"C2665dnf",
      "description":"Color Laser Multifunction Printer",
      "Carbon intensity":13.04,
      "industry":"Office Electronics"
  },
  {
      "name":"C2665dnf",
      "description":"Color Laser Multifunction Printe",
      "Carbon intensity":13.04,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"H625cdw",
      "description":"Color Cloud Multifunction Printer",
      "Carbon intensity":37.85,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"H815dw",
      "description":"Cloud Multifunction Printer",
      "Carbon intensity":121.05,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"H825cdw",
      "description":"Color Cloud Multifunction Printer",
      "Carbon intensity":41.01,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"S2815dn",
      "description":"Smart Multifunction Printer",
      "Carbon intensity":121.05,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"S2825cdn",
      "description":"Color Smart Multifunction Printer",
      "Carbon intensity":41.01,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Desk Top PC  ESPRIMO ?582\/?",
      "description":"Field not included in 2013 data",
      "Carbon intensity":23.79,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Desk top personal computer",
      "description":"Desk Top PC ESPRIMO ?582\/?  Our highly energy efficient model, along with international energy star program. Developed in 2012.",
      "Carbon intensity":23.79,
      "industry":"IT Services"
  },
  {
      "name":"Server",
      "description":"Blade server \"PRIMERGY BX2560 M2\" developed in FY2016.",
      "Carbon intensity":98.57,
      "industry":"Software"
  },
  {
      "name":"Average of all GM vehicles produced and used in the 10 year life-cycle.",
      "description":"Average of all GM vehicles produced and used in the 10 year life-cycle.",
      "Carbon intensity":15.16,
      "industry":"Automobiles"
  },
  {
      "name":"Average of all GM vehicles produced and used in the 10 year life-cycle.",
      "description":"Average of all GM vehicles produced and used in the 10 year life-cycle.",
      "Carbon intensity":18.64,
      "industry":"Automobiles"
  },
  {
      "name":"Average of all GM vehicles produced and used in the 10 year life-cycle.",
      "description":"Average of all GM vehicles produced and used in the 10 year life-cycle.",
      "Carbon intensity":21.48,
      "industry":"Automobiles & components"
  },
  {
      "name":"Average GM Vehicle",
      "description":"Average of all GM vehicles produced and used in the 10 year life-cycle or GM's total carbon footprint.",
      "Carbon intensity":19.99,
      "industry":"Auto Components"
  },
  {
      "name":"Cast iron pipes and fittings",
      "description":"Field not included in 2013 data",
      "Carbon intensity":2.42,
      "industry":"Machinery"
  },
  {
      "name":"Coal",
      "description":"Please note that this factor is representative of our total coal production profile, and is not strictly based upon production volumes sold to NRG.",
      "Carbon intensity":3.03,
      "industry":"Oil, Gas & Consumable Fuels"
  },
  {
      "name":"Elevator",
      "description":"UA-11",
      "Carbon intensity":4.11,
      "industry":"Electronic Equipment, Instruments & Components"
  },
  {
      "name":"Land Cruiser Prado. FJ Cruiser. Dyna trucks. Toyoace.IMV def unit.",
      "description":"Vehicles for which production is contracted to Hino Motors and the finished products are sold by Toyota Motor Corporation: light-duty trucks, 4WD vehicles and SUV. Unit parts that are installed on Toyota pick-up trucks.",
      "Carbon intensity":84.36,
      "industry":"Auto Components"
  },
  {
      "name":"Invercote",
      "description":"The supply of our SBB product, Invercote, produced in Iggesund's Swedish Mill, omitting Carbon sequestration in forests, transport to customers, emissions associated with product use and speculation over potential end of life scenarios.  The intended application for Invercote is as a raw material for the production of packaging components such as Inner Frame, Hinge Lids and Outer Cartons.",
      "Carbon intensity":0.37,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Invercote",
      "description":"The supply of our SBB (solid bleached board) product, Invercote, produced in Iggesund's Swedish Mill, focusing on toes 3 to 7 of our published product specific carbon footprint.",
      "Carbon intensity":0.21,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"Incada",
      "description":"The supply of our FBB product, Incada, produced in Iggesund's UK Mill, omitting Carbon sequestration in forests, transport to customers, emissions associated with product use and speculation over potential end of life scenarios   The intended application for Incada is as a raw material for the production of packaging components such as Inner Frame, Hinge Lids and Outer Cartons.",
      "Carbon intensity":0.29,
      "industry":"Paper & Forest Products"
  },
  {
      "name":"Incada",
      "description":"The supply of our FBB (folding box board) product, Incada, produced in Iggesund's Workington UK Mill, focusing on toes 3 to 7 of our published product specification carbon footprint",
      "Carbon intensity":0.21,
      "industry":"Construction & commercial materials"
  },
  {
      "name":"4Gb LPDDR2 SDRAM",
      "description":"High-performance and low-power memory product, which is used as the main storage device of smartphones, notebook computers, etc.",
      "Carbon intensity":75.48,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"64Gb NAND Flash MLC",
      "description":"High performance NAND Flash product used in the field of mobile phone which high-speed processing is required.",
      "Carbon intensity":82.26,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"4Gb LPDDR3 SDRAM",
      "description":"High-performance and low-power memory product, which is used as the main storage device of smartphones, notebook computers, etc.",
      "Carbon intensity":87.5,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Organic coated coil for the Nature product range (which includes the products Granite\u00c2\u00ae and Estetic\u00c2\u00ae) having a mean surface mass of 4.7kg. The Nature range of innovative chromium-free organic coated steels for the construction industry is the result of 15 years of research in partnership with paint suppliers to develop safer and greener corrosion-inhibiting pigments.",
      "description":"Organic coated coil for the Nature product range (which includes the products Granite\u00c2\u00ae and Estetic\u00c2\u00ae) having a mean surface mass of 4.7kg. The Nature range of innovative chromium-free organic coated steels for the construction industry is the result of 15 years of research in partnership with paint suppliers to develop safer and greener corrosion-inhibiting pigments.",
      "Carbon intensity":1.55,
      "industry":"Metals & Mining"
  },
  {
      "name":"Retaining wall structure with a main wall (sheet pile): 136 tonnes of steel sheet piles and 4 tonnes of tierods per 100 meter wall",
      "description":"Retaining wall structure with a main wall (sheet pile): 136 tonnes of steel sheet piles and 4 tonnes of tierods per 100 meter wall",
      "Carbon intensity":1.19,
      "industry":"Metals & Mining"
  },
  {
      "name":"Ingenico terminals",
      "description":"Point of sales (Wireless or Countertop)",
      "Carbon intensity":83.3,
      "industry":"Computer, IT & telecom"
  },
  {
      "name":"Server CPU",
      "description":"Field not included in 2013 data",
      "Carbon intensity":71.04,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Server CPU",
      "description":"Microprocessors made for servers",
      "Carbon intensity":71.04,
      "industry":"Semiconductors & Semiconductor Equipment"
  },
  {
      "name":"Desktop CPU",
      "description":"Field not included in 2013 data",
      "Carbon intensity":34.29,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Desktop CPU",
      "description":"Microprocessors made for desktop PCs",
      "Carbon intensity":34.29,
      "industry":"Semiconductors & Semiconductor Equipment"
  },
  {
      "name":"Mobile CPU",
      "description":"Field not included in 2013 data",
      "Carbon intensity":17.15,
      "industry":"Computers & Peripherals"
  },
  {
      "name":"Mobile CPU",
      "description":"Microprocessors made for laptop and mobile computing devices",
      "Carbon intensity":17.15,
      "industry":"Semiconductors & Semiconductor Equipment"
  },
  {
      "name":"Complete catalyst system for diesel-powered passenger car exhaust",
      "description":"3 different coated substrates (uncanned) for use together in an exhaust system of a typical mid-sized diesel-powered passenger car calibrated to meet EURO6 emissions standards.",
      "Carbon intensity":94.0,
      "industry":"Chemicals"
  },
  {
      "name":"Three-way Catalyst for gasoline-powered passenger car exhaust",
      "description":"1 coated substrate (uncanned) for use in exhaust system of a typical mid-sized petrol-powered passenger car calibrated to meet EURO6 emissions standards..",
      "Carbon intensity":31.5,
      "industry":"Chemicals"
  }
];
// ===================================

// Helper function to generate keywords from product name
const generateKeywords = (name: string) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // remove special characters
        .split(' ')
        .filter(word => word.length > 2) // filter out short words
        .slice(0, 2) // take the first 2 keywords
        .join('%20');
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// This function will remove all documents from a collection.
async function deleteCollection(collectionPath: string, batchSize: number) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(query: admin.firestore.Query, resolve: (value: unknown) => void) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve(true);
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
}


async function seedDatabase() {
    console.log('Starting to seed database...');

    // Step 1: Process raw data into the format our application needs.
    const foodKeywords = ['food', 'beverage', 'groceries', 'fresh', 'organic'];
    const categoryMapping: Record<string, Product['category']> = {
      'food & beverage': 'Groceries',
      'food products': 'Groceries',
      'beverages': 'Groceries',
      'food & staples retailing': 'Groceries',
      'textiles, apparel & luxury goods': 'Clothing',
      'home durables, textiles, & equipment': 'Clothing',
      'electronic equipment, instruments & components': 'Electronics',
      'computers & peripherals': 'Electronics',
      'computer, it & telecom': 'Electronics',
      'office electronics': 'Electronics',
      'communications equipment': 'Electronics',
      'household durables': 'Home Goods',
      'building products': 'Home Goods',
      'commercial services & supplies': 'Home Goods',
    };

    // De-duplicate and process raw data
    const uniqueProducts = new Map<string, any>();
    rawData.forEach(item => {
        const cleanedName = item.name.trim();
        if (!uniqueProducts.has(cleanedName)) {
            uniqueProducts.set(cleanedName, item);
        }
    });

    const processedProducts: Product[] = Array.from(uniqueProducts.values()).map((item, index) => {
      const industry = (item.industry || '').toLowerCase();
      let category: Product['category'] = 'Home Goods'; // Default category
    
      for (const [key, value] of Object.entries(categoryMapping)) {
        if (industry.includes(key)) {
          category = value;
          break;
        }
      }
      
      const isFoodItem = foodKeywords.some(keyword => industry.includes(keyword));
      const isOrganic = isFoodItem && Math.random() < 0.2;

      // Generate a deterministic, pseudo-random price
      const nameHash = item.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const price = parseFloat(((nameHash % 200) + 5).toFixed(2));
    
      const keywords = generateKeywords(item.name);
      
      return {
        id: `prod_${index + 1}`, // This ID is temporary and won't be stored in Firestore
        name: item.name,
        description: item.description || 'No description available.',
        image: `https://placehold.co/600x400.png?text=${keywords}`,
        carbonIntensity: parseFloat(item["Carbon intensity"]) || 0,
        isOrganic: isOrganic,
        category: category,
        price: price, // Add the generated price here
      };
    });


    // Step 2: Clear existing data
    const productsCollection = db.collection('products');
    console.log('Clearing existing products from the "products" collection...');
    await deleteCollection('products', 400);
    console.log('Existing products cleared.');
    

    // Step 3: Add new data
    console.log(`Adding ${processedProducts.length} new products...`);
    const batchSize = 400; // Firestore batch writes have a limit of 500 operations
    for (let i = 0; i < processedProducts.length; i += batchSize) {
        const batch = db.batch();
        const chunk = processedProducts.slice(i, i + batchSize);
        
        chunk.forEach((product) => {
          // Create a document reference without a specific ID to let Firestore auto-generate it
          const docRef = productsCollection.doc(); 
          // Firestore doesn't like custom `id` fields if we let it auto-generate, 
          // and we don't need to store the id in the document itself.
          const { id, ...productData } = product;
          batch.set(docRef, productData);
        });
        
        await batch.commit();
        console.log(`Batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(processedProducts.length/batchSize)} committed.`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
}

seedDatabase().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
