export function TraineeBadgeFrontHTML({
  name,
  course,
  imageBase64,
  logoBase64,
}: {
  name: string;
  course: string;
  imageBase64: string | null;
  logoBase64: string;
}) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
      </style>
    </head>
    <body style="
      margin:0;
      padding:0;
      font-family:'Arial', 'Helvetica', sans-serif;
      background:#eee;
      width:360px;
      height:450px;
    ">
      <div style="
        position:relative;
        width:100%;
        height:100%;
        background:white;
        border:1px solid #d1d5db;
        border-radius:6px;
        overflow:hidden;
        box-shadow:0 2px 8px rgba(0,0,0,0.1);
      ">

        <!-- Faixa lateral -->
        <div style="
          position:absolute;
          left:0;
          top:0;
          width:80px;
          height:100%;
          background:#F26522;
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:1;
        ">
          <div style="
            transform:rotate(-90deg);
            font-size:32px;
            font-weight:bold;
            color:white;
            letter-spacing:6px;
            white-space:nowrap;
            font-family:'Arial', 'Helvetica', sans-serif;
          ">
            ESTAGIÁRIO
          </div>
        </div>

        <!-- Conteúdo central -->
        <div style="
          position:relative;
          margin-left:80px;
          height:100%;
          padding:24px 20px;
          display:flex;
          flex-direction:column;
          align-items:center;
          z-index:2;
        ">

          <!-- Logo -->
          <div style="
            width:125px;
            margin-bottom:12px;
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <img 
              src="${logoBase64}" 
              style="
                max-width:100%;
                object-fit:contain;
                display:block;
              " 
              alt="Logo"
            />
          </div>

          <!-- Foto -->
          <div style="
            width:160px;
            height:190px;
            margin-bottom:16px;
            position:relative;
            overflow:hidden;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#f3f4f6;
          ">
            ${
              imageBase64
                ? `<img 
                    src="${imageBase64}" 
                    style="
                      width:100%;
                      height:100%;
                      object-fit:cover;
                      display:block;
                    " 
                    alt="Foto"
                  />`
                : `<div style="
                    width:100%;
                    height:100%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                  ">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="#9ca3af">
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
                    </svg>
                  </div>`
            }
          </div>

          <!-- Nome -->
          <div style="
            width:100%;
            padding:0 10px;
            margin-bottom:4px;
            text-align:center;
          ">
            <p style="
              font-size:22px;
              font-weight:bold;
              line-height:1.2;
              color:#000;
              word-wrap:break-word;
              overflow-wrap:break-word;
              max-height:60px;
              overflow:hidden;
              font-family:'Arial', 'Helvetica', sans-serif;
            ">
              ${name}
            </p>
          </div>

          <!-- Curso -->
          <div style="
            width:100%;
            padding:0 10px;
            text-align:center;
          ">
            <p style="
              font-size:18px;
              color:#374151;
              line-height:1.3;
              word-wrap:break-word;
              overflow-wrap:break-word;
              max-height:50px;
              overflow:hidden;
              font-family:'Arial', 'Helvetica', sans-serif;
            ">
              ${course}
            </p>
          </div>
        </div>

      </div>
    </body>
  </html>
`;
}