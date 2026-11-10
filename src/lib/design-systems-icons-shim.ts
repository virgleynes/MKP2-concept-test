// bench-shells IASRailNav imports CirclesClusterThin / PersonTwoThin, but
// @design-systems/icons only ships CirclesCluster / PersonTwo. Re-export the
// full icon set and alias the missing Thin names until bench-shells is updated.
export * from "../../node_modules/@design-systems/icons/dist/esm/index.js";
export {
  CirclesCluster as CirclesClusterThin,
  OverflowWeb as OverflowVertical,
  PersonTwo as PersonTwoThin,
} from "../../node_modules/@design-systems/icons/dist/esm/index.js";
