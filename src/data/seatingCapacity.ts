// export type SeatingMode = "compact" | "comfortable" | "tight";

// type CapacityRow = {
//   length: number;
//   tight?: number;
//   comfortable?: number;
// };

// export const SEATING_CAPACITY: CapacityRow[] = [
//   { length: 1200, tight: 6, comfortable: 4 },
//   { length: 1300, tight: 6, comfortable: 4 },
//   { length: 1400, comfortable: 4 },
//   { length: 1500, comfortable: 6 },
//   { length: 1600, comfortable: 6 },
//   { length: 1700, comfortable: 6 },
//   { length: 1800, tight: 8, comfortable: 6 },
//   { length: 1900, tight: 8, comfortable: 6 },
//   { length: 2000, comfortable: 8 },
//   { length: 2100, comfortable: 8 },
//   { length: 2200, comfortable: 8 },
//   { length: 2300, comfortable: 8 },
//   { length: 2400, tight: 10, comfortable: 8 },
//   { length: 2500, tight: 10, comfortable: 8 },
//   { length: 2600, comfortable: 10 },
//   { length: 2700, comfortable: 10 },
//   { length: 2800, comfortable: 10 },
//   { length: 2900, comfortable: 10 },
//   { length: 3000, tight: 12, comfortable: 10 },
//   { length: 3100, comfortable: 12 },
//   { length: 3180, comfortable: 12 },
// ];

// export function getMaxChairs(length: number) {
//   const closest = [...SEATING_CAPACITY]
//     .reverse()
//     .find(row => length >= row.length);

//   if (!closest) return { max: 4, mode: "comfortable" as SeatingMode };

//   const max =
//     closest.tight ?? closest.comfortable ?? 4;

//   let mode: SeatingMode = "comfortable";

//   if (closest.tight && max === closest.tight) {
//     mode = "tight";
//   }

//   return { max, mode };
// }


export type SeatingMode = "compact" | "comfortable" | "tight";
export type TableShape = "rectangular" | "round" | "square";

type CapacityRow = {
  length: number;
  tight?: number;
  comfortable?: number;
};

const RECTANGULAR_CAPACITY: CapacityRow[] = [
  { length: 1200, tight: 6, comfortable: 4 },
  { length: 1300, tight: 6, comfortable: 4 },
  { length: 1400, comfortable: 4 },
  { length: 1500, comfortable: 6 },
  { length: 1600, comfortable: 6 },
  { length: 1700, comfortable: 6 },
  { length: 1800, tight: 8, comfortable: 6 },
  { length: 1900, tight: 8, comfortable: 6 },
  { length: 2000, comfortable: 8 },
  { length: 2100, comfortable: 8 },
  { length: 2200, comfortable: 8 },
  { length: 2300, comfortable: 8 },
  { length: 2400, tight: 10, comfortable: 8 },
  { length: 2500, tight: 10, comfortable: 8 },
  { length: 2600, comfortable: 10 },
  { length: 2700, comfortable: 10 },
  { length: 2800, comfortable: 10 },
  { length: 2900, comfortable: 10 },
  { length: 3000, tight: 12, comfortable: 10 },
  { length: 3100, comfortable: 12 },
  { length: 3180, comfortable: 12 },
];

const ROUND_CAPACITY: CapacityRow[] = [
  { length: 1200, tight: 6 },
  { length: 1300, tight: 6 },
  { length: 1400, tight: 7, comfortable: 6 },
  { length: 1500, tight: 7 },
  { length: 1580, tight: 8 },
];

const SQUARE_CAPACITY: CapacityRow[] = [
  { length: 1200, tight: 6 },
  { length: 1300, tight: 6 },
  { length: 1400, tight: 8 },
  { length: 1500, tight: 8 },
  { length: 1580, tight: 8 },
];

export function getMaxChairs(length: number, shape: TableShape = "rectangular") {
  // Select the correct data set based on shape
  const dataset = 
    shape === "round" ? ROUND_CAPACITY : 
    shape === "square" ? SQUARE_CAPACITY : 
    RECTANGULAR_CAPACITY;

  const closest = [...dataset]
    .reverse()
    .find(row => length >= row.length);

  // Default fallback if table is smaller than 1200
  if (!closest) return { max: 4, mode: "comfortable" as SeatingMode };

  // Logic: Prefer Tight if it exists, otherwise use Comfortable
  const max = closest.tight ?? closest.comfortable ?? 4;
  
  let mode: SeatingMode = "comfortable";
  if (closest.tight && max === closest.tight) {
    mode = "tight";
  }

  return { max, mode };
}