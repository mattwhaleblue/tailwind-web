const fs = require("fs");
const path = require("path");

const addReactSugar = (fileName, html) => {
    const updatedFileName = fileName.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('').split('.')[0];
    return `import React from "react";\nexport const ${updatedFileName} = () => { return (\n${html}\n)}`;
}

const replaceComments = (html) => {
    return html.replaceAll(`<!--`, `{/**`).replaceAll(`-->`, `*/}`).replaceAll('class', 'className')
}

const addSelfClosing = (html) => {
    // return html.replaceAll(`'>`, `'/>`);
    return html.split(`\n`).map((line) => {
        if (line.includes('<img')) {
            return line.replace(`'>`, `'/>`);
        } 
        return line;
    }).join(`\n`);
}

fs.readdirSync(path.resolve(__dirname, "./src/components")).forEach((file) => {
  console.log("file", file);
  const fileContents = fs.readFileSync(path.resolve(__dirname, `./src/components/${file}`));

  console.log('file contents', fileContents.toString());
  const withUpdatedComments = replaceComments(fileContents.toString());
  const withSelfClosing = addSelfClosing(withUpdatedComments);
  const react = addReactSugar(file, withSelfClosing);
  console.log('react', react);
  fs.writeFileSync(`./src/react-components/${file.split('.')[0]}.jsx`, react);
});
