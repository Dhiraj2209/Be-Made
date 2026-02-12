export interface TopColorOption {
  id: string
  title: string
  folder: string
  description: string
  type: 'Natural' | 'Polish' | 'Silk'
}

export const TOP_COLORS: TopColorOption[] = [
  // --------- NATURAL ---------
  { id: 'amani_grey', title: 'Amani Grey', folder: 'amani_grey' , description: 'Soft dove grey with calm movement, ideal for minimalist interiors.', type: 'Natural'},
  { id: 'anatolia', title: 'Anatolia', folder: 'anatolia' ,description: 'Warm stone tones with gentle depth, balancing classic and modern spaces.', type: 'Natural'},
  { id: 'calacatta_black', title: 'Calacatta Black', folder: 'calacatta_black',description: 'Striking black base with crisp veins for high-contrast luxury.', type: 'Natural'},
  { id: 'pietra_stone', title: 'Pietra Stone', folder: 'pietra_stone' ,description: 'Stone-like texture and neutral palette suit versatile design styles.', type: 'Natural'},
  { id: 'roman', title: 'Roman', folder: 'roman',description: 'Classic marble inspiration with balanced veins for timeless appeal.', type: 'Natural'},
  { id: 'storm', title: 'Storm', folder: 'storm',description: 'Moody greys and flowing lines deliver dramatic modern character.', type: 'Natural'},
  { id: 'magma', title: 'Magma', folder: 'magma' ,description: 'Dark volcanic character delivers bold energy and striking contrast.', type: 'Natural'},
  { id: 'noce', title: 'Noce', folder: 'noce',description: 'Walnut-inspired brown tones bring comfort, richness, and maturity.', type: 'Natural'},
  { id: 'taj_mahal', title: 'Taj Mahal', folder: 'taj_mahal',description: 'Soft beige veining captures understated luxury and natural grace.', type: 'Natural'},
  { id: 'velvet_black', title: 'Velvet Black', folder: 'velvet_black',description: 'Velvety black finish offers bold contrast and premium drama.', type: 'Natural'},
  { id: 'sienna_bronze', title: 'Sienna Bronze', folder: 'sienna_bronze',description: 'Burnt bronze tones create a warm, artisanal aesthetic.', type: 'Natural'},
  { id: 'vintage_bronze', title: 'Vintage Bronze', folder: 'vintage_bronze',description: 'Aged bronze effect adds heritage charm and warm depth.', type: 'Natural'},

  // --------- POLISH ---------
  { id: 'fior', title: 'Fior', folder: 'fior' ,description: 'Delicate veining gives a fresh, airy, contemporary finish.', type: 'Polish'},
  { id: 'gold_onyx', title: 'Gold Onyx', folder: 'gold_onyx',description: 'Translucent-style gold tones add dramatic depth and visual richness.', type: 'Polish'},
  { id: 'lucid', title: 'Lucid', folder: 'lucid',description: 'Crisp light tones create an open, modern, uncluttered vibe.', type: 'Polish'},
  { id: 'pearl_mist', title: 'Pearl Mist', folder: 'pearl_mist',description: 'Silvery pearl notes produce a calm, luminous surface.', type: 'Polish'},
  { id: 'calacatta_lux', title: 'Calacatta Lux', folder: 'calacatta_lux',description: 'Bright white body and flowing veins for a polished premium look.', type: 'Polish'},
  { id: 'elegance', title: 'Elegance', folder: 'elegance',description: 'Clean pattern and balanced tones deliver timeless sophistication.', type: 'Polish'},
  { id: 'orova', title: 'Orova', folder: 'orova' ,description: 'Golden-beige movement offers a soft luxurious statement.', type: 'Polish'},
  { id: 'premium_gold', title: 'Premium Gold', folder: 'premium_gold',description: 'Refined gold veining adds upscale warmth to any setting.', type: 'Polish'},
  { id: 'velvet', title: 'Velvet', folder: 'velvet' ,description: 'Smooth matte character gives a soft, elegant visual feel.', type: 'Polish'},
  { id: 'veneto', title: 'Veneto', folder: 'veneto' ,description: 'Italian-inspired pattern blends tradition with clean modern styling.', type: 'Polish'},
  { id: 'desert_dune', title: 'Desert Dune', folder: 'desert_dune',description: 'Sandy neutrals and soft texture echo relaxed desert elegance.', type: 'Polish'},
  { id: 'venus_vein', title: 'Venus Vein', folder: 'venus_vein',description: 'Graceful veins sweep across a bright base with elegance.', type: 'Polish'},
  { id: 'taj_mahal', title: 'Taj Mahal', folder: 'taj_mahal',description: 'Soft beige veining captures understated luxury and natural grace.', type: 'Polish'},
  { id: 'cartier_gold', title: 'Cartier Gold', folder: 'cartier_gold' ,description: 'Rich golden accents bring warmth and a luxe designer feel.', type: 'Polish'},
  { id: 'aristocrat', title: 'Aristocrat', folder: 'aristocrat',description: 'Bold charcoal veining adds upscale drama without overwhelming the room.', type: 'Polish'},

  // --------- SILK ---------
  { id: 'shadow_white', title: 'Shadow White', folder: 'shadow_white',description: 'Cool white base with shadowed veins for subtle depth.', type: 'Silk'},
  { id: 'autumn_bronze', title: 'Autumn Bronze', folder: 'autumn_bronze',description: 'Earthy bronze shades create a cozy, refined statement surface.' , type: 'Silk'},
  { id: 'ivory', title: 'Ivory', folder: 'ivory',description: 'Creamy ivory surface brightens rooms with subtle natural character.', type: 'Silk' },
  // { id: 'cartier_gold', title: 'Cartier Gold', folder: 'cartier_gold' ,description: 'Rich golden accents bring warmth and a luxe designer feel.', type: 'Silk'},
  // { id: 'aristocrat', title: 'Aristocrat', folder: 'aristocrat',description: 'Bold charcoal veining adds upscale drama without overwhelming the room.', type: 'Silk'},

  // --------- COMMENTED OUT ---------
  // { id: 'kenya', title: 'Kenya', folder: 'kenya' ,description: 'Deep earthy hues offer grounded style with organic charm.'},
  // { id: 'mont_blanc_texture', title: 'Mont Blanc Texture', folder: 'mont_blanc_texture',description: 'Textured alpine-inspired whites add tactile depth and premium presence.' },
  // { id: 'moss_blanc', title: 'Moss Blanc', folder: 'moss_blanc' ,description: 'Muted green-grey undertones create a serene, nature-led finish.'},
  // { id: 'mother_earth', title: 'Mother Earth', folder: 'mother_earth',description: 'Layered earthy colors give authentic warmth and grounded beauty.' },
  // { id: 'skye', title: 'Skye', folder: 'skye' ,description: 'Cloudy blue-grey hints evoke airy, serene sophistication.'},
  // { id: 'twilight', title: 'Twilight', folder: 'twilight',description: 'Dusky tones create intimate ambience with contemporary edge.' },
  // { id: 'wild_forest', title: 'Wild Forest', folder: 'wild_forest',description: 'Deep green movement evokes lush nature and bold personality.' },
];
