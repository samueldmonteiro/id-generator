export function InstitutionalBadgeHTML({
  name,
  position,
  imageBase64,
  logoAnhangueraBase64,
  logoPitagorasBase64,
}: {
  name: string;
  position: string;
  imageBase64: string | null;
  logoAnhangueraBase64: string;
  logoPitagorasBase64: string;
}) {
  const isProfessor = position === "PROFESSOR" || position === "PROFESSORA";

  if (isProfessor) {
    // =============================
    //  TEMPLATE PROFESSOR (PITÁGORAS)
    // =============================
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=360, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body, html {
            width: 360px !important;
            height: 500px !important;
            overflow: hidden !important;
          }
        </style>
      </head>
      <body style="
        margin:0 !important;
        padding:0 !important;
        font-family:'Arial', 'Helvetica', sans-serif !important;
        background:#eee !important;
        width:360px !important;
        height:500px !important;
        display:flex !important;
        align-items:center !important;
        justify-content:center !important;
        overflow:hidden !important;
      ">
        <!-- Container principal com dimensões fixas -->
        <div style="
          width:360px !important;
          height:500px !important;
          background:white !important;
          border-radius:6px !important;
          overflow:hidden !important;
          box-shadow:0 2px 8px rgba(0,0,0,0.1) !important;
          display:flex !important;
          flex-direction:column !important;
          align-items:center !important;
          padding-top:24px !important;
        ">

          <!-- Logo -->
          <div style="
            width:125px;
            margin-bottom:14px !important;
            display:flex !important;
            align-items:center !important;
            justify-content:center !important;
            flex-shrink:0 !important;
          ">
            <img src="${logoPitagorasBase64}" style="
              max-width:100% !important;
              object-fit:contain !important;
              display:block !important;
            " alt="Logo Pitágoras"/>
          </div>

          <!-- Foto -->
          <div style="
            width:180px !important;
            height:210px !important;
            margin-bottom:20px !important;
            overflow:hidden !important;
            display:flex !important;
            align-items:center !important;
            justify-content:center !important;
            background:#f3f4f6 !important;
            position:relative !important;
            flex-shrink:0 !important;
          ">
            ${
              imageBase64
                ? `<img src="${imageBase64}" style="
                    width:100% !important;
                    height:100% !important;
                    object-fit:cover !important;
                    display:block !important;
                  " alt="Foto"/>`
                : `<div style="
                    width:100% !important;
                    height:100% !important;
                    display:flex !important;
                    align-items:center !important;
                    justify-content:center !important;
                  ">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="#9ca3af">
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                    </svg>
                  </div>`
            }
          </div>

          <!-- Nome -->
          <div style="
            width:100% !important;
            padding:0 20px !important;
            margin-bottom:4px !important;
            text-align:center !important;
            flex-shrink:0 !important;
          ">
            <p style="
              font-size:26px !important;
              font-weight:bold !important;
              color:black !important;
              text-align:center !important;
              line-height:1.2 !important;
              word-wrap:break-word !important;
              overflow-wrap:break-word !important;
              max-height:65px !important;
              overflow:hidden !important;
              font-family:'Arial', 'Helvetica', sans-serif !important;
            ">
              ${name}
            </p>
          </div>

          <!-- Cargo -->
          <div style="
            width:100% !important;
            padding:0 20px !important;
            margin-bottom:4px !important;
            text-align:center !important;
            flex-shrink:0 !important;
          ">
            <p style="
              font-size:22px !important;
              font-style:italic !important;
              color:#374151 !important;
              text-align:center !important;
              line-height:1.3 !important;
              word-wrap:break-word !important;
              overflow-wrap:break-word !important;
              max-height:60px !important;
              overflow:hidden !important;
              font-family:'Arial', 'Helvetica', sans-serif !important;
            ">
              ${position}
            </p>
          </div>

          <!-- Barra inferior -->
          <div style="
            width:100% !important;
            height:28px !important;
            background:linear-gradient(to right, #FFCC00, #F26522) !important;
            margin-top:auto !important;
            flex-shrink:0 !important;
          "></div>

        </div>
      </body>
    </html>
    `;
  }

  // =============================
  //  TEMPLATE PADRÃO (ANHANGUERA)
  // =============================
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=360, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body, html {
          width: 360px !important;
          height: 500px !important;
          overflow: hidden !important;
        }
      </style>
    </head>
    <body style="
      margin:0 !important;
      padding:0 !important;
      font-family:'Arial', 'Helvetica', sans-serif !important;
      background:#eee !important;
      width:360px !important;
      height:500px !important;
      display:flex !important;
      align-items:center !important;
      justify-content:center !important;
      overflow:hidden !important;
    ">
      <!-- Container principal com dimensões fixas -->
      <div style="
        position:relative !important;
        width:360px !important;
        height:500px !important;
        background:white !important;
        border:1px solid #d1d5db !important;
        border-radius:6px !important;
        overflow:hidden !important;
        box-shadow:0 2px 8px rgba(0,0,0,0.1) !important;
      ">

        <!-- Faixa lateral -->
        <div style="
          position:absolute !important;
          left:0 !important;
          top:0 !important;
          width:80px !important;
          height:500px !important;
          background:#F26522 !important;
          display:flex !important;
          align-items:center !important;
          justify-content:center !important;
          z-index:1 !important;
        ">
          <div style="
            transform:rotate(-90deg) !important;
            transform-origin:center !important;
            font-size:26px !important;
            font-weight:bold !important;
            color:white !important;
            letter-spacing:4px !important;
            text-transform:uppercase !important;
            white-space:nowrap !important;
            font-family:'Arial', 'Helvetica', sans-serif !important;
          ">
            ${position}
          </div>
        </div>

        <!-- Conteúdo -->
        <div style="
          position:relative !important;
          margin-left:80px !important;
          height:500px !important;
          padding-top:24px !important;
          display:flex !important;
          flex-direction:column !important;
          align-items:center !important;
          z-index:2 !important;
        ">

          <!-- Logo -->
          <div style="
            width:125px;
            margin-bottom:14px !important;
            display:flex !important;
            align-items:center !important;
            justify-content:center !important;
            flex-shrink:0 !important;
          ">
            <img src="${logoAnhangueraBase64}" style="
              max-width:100% !important;
              object-fit:contain !important;
              display:block !important;
            " alt="Logo Anhanguera"/>
          </div>

          <!-- Foto -->
          <div style="
            width:180px !important;
            height:210px !important;
            margin-bottom:20px !important;
            overflow:hidden !important;
            display:flex !important;
            align-items:center !important;
            justify-content:center !important;
            background:#f3f4f6 !important;
            position:relative !important;
            flex-shrink:0 !important;
          ">
            ${
              imageBase64
                ? `<img src="${imageBase64}" style="
                    width:100% !important;
                    height:100% !important;
                    object-fit:cover !important;
                    display:block !important;
                  " alt="Foto"/>`
                : `<div style="
                    width:100% !important;
                    height:100% !important;
                    display:flex !important;
                    align-items:center !important;
                    justify-content:center !important;
                  ">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="#9ca3af">
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                    </svg>
                  </div>`
            }
          </div>

          <!-- Nome -->
          <div style="
            width:100% !important;
            padding:0 20px !important;
            margin-bottom:10px !important;
            text-align:center !important;
            flex-shrink:0 !important;
          ">
            <p style="
              font-size:26px !important;
              font-weight:bold !important;
              color:black !important;
              text-align:center !important;
              line-height:1.2 !important;
              word-wrap:break-word !important;
              overflow-wrap:break-word !important;
              max-height:100px !important;
              overflow:hidden !important;
              font-family:'Arial', 'Helvetica', sans-serif !important;
            ">
              ${name}
            </p>
          </div>

          <!-- Espaço reservado para layout -->
          <div style="
            width:100% !important;
            height:40px !important;
            flex-grow:1 !important;
            margin-bottom:auto !important;
          "></div>

        </div>

      </div>
    </body>
  </html>
  `;
}