import { Fragment } from "react"

/** Splits text into inline-block spans so GSAP can fade them in word by word. */
export default function Words({ text }) {
  return text.split(" ").map((v, i) => (
    <Fragment key={i}>
      <span style={{ display: "inline-block" }}>{v}</span>{" "}
    </Fragment>
  ))
}
