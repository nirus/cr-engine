import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

export function rehypeFigure(option) {
    const className = (option && option.className) || "rehype-figure"

    function buildFigure({ properties }) {
        console.log({ properties })

        try {
            const { alt } = properties;
            console.log({ alt })
            /**
             * @credits: https://stackoverflow.com/a/34763398/1848109
             */
            const attr = JSON.parse(alt.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": '));
            console.log({ attr })
            const { caption, ...props } = attr;
            properties = { ...properties, ...props }
            properties.alt = caption;
        } catch (error) {
            //Suppress the warning
            console.log('Error happened', error)
        }

        const figure = h("figure", { class: className }, [
            h("img", { ...properties }),
            properties.alt && properties.alt.trim().length > 0
                ? h("figcaption", properties.alt)
                : "",
        ])
        return figure
    }

    return function (tree) {
        visit(tree, { tagName: "p" }, (node, index) => {
            const images = node.children
                .filter((n) => {
                    const isImg = n.tagName === "img"
                    isImg && console.log({ img: n });
                    return isImg;
                })
                .map((img) => buildFigure(img))

            if (images.length === 0) return

            tree.children[index] =
                images.length === 1
                    ? images[0]
                    : (tree.children[index] = h(
                        "div",
                        { class: `${className}-container` },
                        images
                    ))
        })
    }
}