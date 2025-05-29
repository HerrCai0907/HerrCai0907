import { writeFileSync } from "fs";

function drawItem(topItem, index) {
  return `
  <g transform="translate(0, ${0 + index * 40})">
    <g class="stagger" style="animation-delay: ${450 + 150 * index}ms">
      <text data-testid="lang-name" x="2" y="15" class="lang-name">${topItem.lang}</text>
      <text x="215" y="34" class="lang-name">${topItem.rate.toFixed(2)}%</text>
      <svg width="205" x="0" y="25">
        <rect rx="5" ry="5" x="0" y="0" width="205" height="8" fill="#ddd"></rect>
        <svg data-testid="lang-progress" width="${topItem.rate.toFixed(2)}%">
          <rect height="8" fill="${topItem.color}" rx="5" ry="5" x="0" y="0" class="lang-progress"
            style="animation-delay: ${750 + 150 * index}ms;" />
        </svg>
      </svg>
    </g>
  </g>
  `;
}

export function draw(topInfo) {
  const len = topInfo.length;
  const width = len * 40 + 85;

  const svg = `
<svg width="300" height="${width}" viewBox="0 0 300 ${width}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"
aria-labelledby="descId">
<title id="titleId"></title>
<desc id="descId"></desc>
<style>
  .header {
    font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
    fill: #fe428e;
    animation: fadeInAnimation 0.8s ease-in-out forwards;
  }

  @supports(-moz-appearance: auto) {

    /* Selector detects Firefox */
    .header {
      font-size: 15.5px;
    }
  }

  @keyframes slideInAnimation {
    from {
      width: 0;
    }

    to {
      width: calc(100%-100px);
    }
  }

  @keyframes growWidthAnimation {
    from {
      width: 0;
    }

    to {
      width: 100%;
    }
  }

  .stat {
    font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
    fill: #a9fef7;
  }

  @supports(-moz-appearance: auto) {

    /* Selector detects Firefox */
    .stat {
      font-size: 12px;
    }
  }

  .bold {
    font-weight: 700
  }

  .lang-name {
    font: 400 11px "Segoe UI", Ubuntu, Sans-Serif;
    fill: #a9fef7;
  }

  .stagger {
    opacity: 0;
    animation: fadeInAnimation 0.3s ease-in-out forwards;
  }

  #rect-mask rect {
    animation: slideInAnimation 1s ease-in-out forwards;
  }

  .lang-progress {
    animation: growWidthAnimation 0.6s ease-in-out forwards;
  }

  /* Animations */
  @keyframes scaleInAnimation {
    from {
      transform: translate(-5px, 5px) scale(0);
    }

    to {
      transform: translate(-5px, 5px) scale(1);
    }
  }

  @keyframes fadeInAnimation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
</style>



<rect data-testid="card-bg" x="0.5" y="0.5" rx="4.5" height="99%" stroke="#e4e2e2" width="299" fill="#141321"
  stroke-opacity="1" />
<g data-testid="card-title" transform="translate(25, 35)">
  <g transform="translate(0, 0)">
    <text x="0" y="0" class="header" data-testid="header">Most Used in 7 Days</text>
  </g>
</g>


<g data-testid="main-card-body" transform="translate(0, 55)">

  <svg data-testid="lang-items" x="25">
    ${topInfo.map((item, index) => drawItem(item, index)).join("\n")}
  </svg>
</g>
</svg>
`;

  writeFileSync("fetcher/lang.svg", svg);
}
