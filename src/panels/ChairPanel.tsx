// import { observer } from "mobx-react-lite";
// import { CHAIR_OPTIONS } from "../data/chairOptions";
// import { CHAIR_COLOR_OPTIONS } from "../data/ChairColorOptions";
// import { configuratorStore } from "../store/configuratorStore";
// import './../styles/chair.css'
// import { getMaxChairs } from "./../data/seatingCapacity"; 

// export const ChairPanel = observer(() => {
//   const activeChairId = configuratorStore.chairId;
//   const activeColorId = configuratorStore.chairColorId;

//   // const availableColors = activeChairId
//   //   ? CHAIR_COLOR_OPTIONS[activeChairId] ?? []
//   //   : [];
//   const availableColors =
//   activeChairId
//     ? CHAIR_COLOR_OPTIONS[activeChairId] ?? []
//     : [];
// const { mode } = getMaxChairs(configuratorStore.topLength);
// const seatingLabel =
//   mode === "tight"
//     ? "Tight Seating"
//     : "Comfortable Seating";

//   return (
//     <div className="chair-panel-wrapper">
//       <div className="panel-header">
//         <h2 className="main-title">Wear It With</h2>
//         <p className="sub-title">{seatingLabel}</p>

//       </div>

//       <div className="chair-selection-grid">
//         {CHAIR_OPTIONS.map((chair) => (
//           <div
//             key={chair.id}
//             className={`chair-item ${
//               activeChairId === chair.id ? 'active' : ''
//             }`}
//             onClick={() => configuratorStore.setChair(chair.id)}
//           >
//             <div className="chair-preview-box">
//               <img src={chair.image} alt={chair.title} />
//               {activeChairId === chair.id && (
//                 <div className="selection-badge">✓</div>
//               )}
//             </div>
//             <span className="chair-name">{chair.title}</span>
//           </div>
//         ))}
//       </div>

//       {activeChairId && (
//         <>
//           <div className="option-group">
//             <h3 className="group-label">Select Chair Color</h3>
//             <div className="swatch-list">
//               {availableColors.map((color) => (
//                 <button
//                   key={color.id}
//                   className={`color-swatch ${
//                     activeColorId === color.id ? 'active' : ''
//                   }`}
//                   onClick={() =>
//                     configuratorStore.setChairColor(color.id)
//                   }
//                   aria-label={color.title}
//                 >
//                   <img
//                     src={color.preview}
//                     alt={color.title}
//                     onError={(e) => {
//                       const target = e.target as HTMLImageElement
//                       if (target.src.endsWith('/preview.webp')) {
//                         target.src = color.preview.replace('/preview.webp', '/thumbnail.webp')
//                       }
//                     }}
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="option-group">
//             <h3 className="group-label">
//               Select Chair Quantity
//             </h3>
//             <div className="quantity-control-ui">
//               <button
//                 className="qty-btn"
//                 onClick={() =>
//                   configuratorStore.setChairQty(
//                     Math.max(1, configuratorStore.chairQty - 1)
//                   )
//                 }
//               >
//                 −
//               </button>

//               <div className="qty-value">
//                 {configuratorStore.chairQty}
//               </div>

//               <button
//                 className="qty-btn"
//                 onClick={() =>
//                   configuratorStore.setChairQty(
//                     configuratorStore.chairQty + 1
//                   )
//                 }
//               >
//                 +
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       <div className="be-made-footer">BeMade™</div>
//     </div>
//   );
// });
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { CheckCircle2 } from "lucide-react";
import { CHAIR_OPTIONS } from "../data/chairOptions";
import { CHAIR_COLOR_OPTIONS } from "../data/ChairColorOptions";
import { configuratorStore } from "../store/configuratorStore";
import { getMaxChairs } from "./../data/seatingCapacity"; 
import './../styles/chair.css';

// Mapping table IDs to their specific page index
const SHAPE_PDF_MAPPING: Record<string, number> = {
  "CAPSULE" : 1,
  "RECTANGLE": 2,
  "OBLONG": 3,
  "ROUND": 5,
  "SQAURE" : 5,
  "OVAL": 4
};

export const ChairPanel = observer(() => {
  const [showInfo, setShowInfo] = useState(false);
  
  const activeChairId = configuratorStore.chairId;
  const activeColorId = configuratorStore.chairColorId;
  const tableShape = configuratorStore.topId;

  const availableColors = activeChairId
    ? CHAIR_COLOR_OPTIONS[activeChairId] ?? []
    : [];

  const { mode } = getMaxChairs(configuratorStore.topLength);
  const seatingLabel = mode === "tight" ? "Tight Seating" : "Comfortable Seating";

  /**
   * NOTE: To show ONLY the page as an image, we use an <img> tag.
   * If you have exported the PDF pages as images (recommended), use the path below.
   * Example: /assets/images/guide_page_1.png
   */
  const pageNum = SHAPE_PDF_MAPPING[tableShape] || 1;
  const imagePath = `/assets/images/chairSize/${pageNum}.png`; 

  return (
    <div className="chair-panel-wrapper">
      {/* INFO POPUP MODAL */}
      {showInfo && (
        <div className="info-modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="info-modal-content image-mode" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowInfo(false)}>×</button>
            
            <div className="modal-body">
              <h3 className="modal-title">{tableShape} Seating Guide</h3>
              <div className="guide-image-container">
                <img 
                  src={imagePath} 
                  alt={`Seating guide for ${tableShape}`} 
                  className="guide-page-img"
                  onError={(e) => {
                    // Fallback to PDF if image version doesn't exist
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1100?text=Please+Export+PDF+Page+to+PNG';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="panel-header">
        <h2 className="main-title">Wear It With</h2>
        <p className="sub-title">{seatingLabel}</p>
      </div>

      <div className="chair-selection-grid">
        {CHAIR_OPTIONS.map((chair) => (
          <div
            key={chair.id}
            className={`chair-item ${activeChairId === chair.id ? 'active' : ''}`}
            onClick={() => configuratorStore.setChair(chair.id)}
          >
            <div className="chair-preview-box">
              <img src={chair.image} alt={chair.title} />
              {activeChairId === chair.id && (
                <CheckCircle2 className="unified-selected-icon" />
              )}
            </div>
            <span className="chair-name">{chair.title}</span>
          </div>
        ))}
      </div>

      {activeChairId && (
        <>
          <div className="option-group">
            <h3 className="group-label">Select Chair Color</h3>
            <div className="swatch-list">
              {availableColors.map((color) => (
                <button
                  key={color.id}
                  className={`color-swatch round ${activeColorId === color.id ? 'active' : ''}`}
                  onClick={() => configuratorStore.setChairColor(color.id)}
                >
                  <img src={color.preview} alt={color.title} />
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <h3 className="group-label">
              Select Chair Quantity
              <span className="info-icon" onClick={() => setShowInfo(true)}>i</span>
            </h3>
            <div className="quantity-control-ui">
              <button className="qty-btn" onClick={() => configuratorStore.setChairQty(configuratorStore.chairQty - 2)}>−</button>
              <div className="qty-value">{configuratorStore.chairQty}</div>
              <button className="qty-btn" onClick={() => configuratorStore.setChairQty(configuratorStore.chairQty + 2)}>+</button>
            </div>
          </div>
        </>
      )}

      <div className="be-made-footer">BeMade™</div>
    </div>
  );
});
