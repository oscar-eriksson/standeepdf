# Standee2PDF 🎨📏

A powerful, high-precision generator for tabletop gaming standees. Designed to make the transition from digital art to physical table as seamless and efficient as possible.

## 🌐 Live Demo

Try it out here: [https://standee2pdf.oscr.se](https://standee2pdf.oscr.se)

## 🚀 Key Features

- **Multi-page PDF Export**: Automatically handles large batches of standees across multiple A4 pages.
- **Auto-Layout System**: Intelligently arranges standees to maximize paper usage and minimize waste.
- **Smart Background Removal**: Built-in AI-powered background removal using [`@imgly/background-removal`](https://github.com/imgly/background-removal-js), allowing you to drop in any character art and get a clean standee instantly.
- **Numbering & Lettering Tokens**: Easily manage identical miniatures with a configurable token system (numeric or alphabetic).
- **Visual Height Ruler**: A draggable, semi-transparent ruler to verify the physical scale of your miniatures before printing.
- **"Feet-to-Feet" Layout**: Optimized layout for easy folding and gluing, ensuring a symmetrical upright and mirrored side.

## 🛠️ Development

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/oscar-eriksson/standeepdf.git
   cd standeepdf
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```

### Building for Production

To generate a production-ready bundle in the `dist` folder:

```bash
npm run build
```

## 🧪 Testing

The project uses **Cypress** for end-to-end testing to ensure critical flows like image processing and PDF generation are always working.

- **Run Headless Tests**: `npm run test:e2e`
- **Open Cypress UI**: `npm run cy:open`

For more details on testing prerequisites and scenarios, see [TESTING.md](./TESTING.md).

## 🛡️ Technical Considerations

- **Frontend**: Svelte 5 + TypeScript + Vite.
- **PDF Generation**: Powered by `jspdf`, working with raw pixel data to ensure maximum image quality without re-compression.
- **Styling**: Vanilla CSS with modern features like glassmorphism and CSS variables for theming.

## 🤖 AI Disclaimer

This project utilizes AI in two primary ways:

1.  **Development**: The codebase was developed collaboratively with **Antigravity**, an agentic AI coding assistant. While AI-assisted, all functionality has been verified and tested.
2.  **Features**: The background removal feature leverages a neural network model (via [`@imgly/background-removal`](https://github.com/imgly/background-removal-js)) that runs entirely in your browser. No image data is sent to external servers.

---

_Built with Antigravity_
