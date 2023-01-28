const baseURL = (isURL(location.href)) ? "https://gianzellweger.github.io/math-docs" : ((location.href.slice(0, 7) == "file://") ? "file:///Users/gian/Desktop/Applescript%20Libraries/Math/website" : alert("unreachable"))

class Func {
    constructor(name, text, shortDescription, outputArgs, inputArgs, desmosURL) {
        this.name = name;
        this.text = text;
        if (shortDescription) {
            this.shortDescription = shortDescription;
        }
        if (inputArgs) {
            this.inputArgs = inputArgs;
        }
        if (outputArgs) {
            this.outputArgs = outputArgs;
        }
        if (desmosURL) {
            this.desmosURL = desmosURL;
        }
    }
    get signature() {
        let signature = "";
        if (this.inputArgs && this.outputArgs) {
            if (this.outputArgs.length == 1) {
                signature += this.outputArgs[0].toString() + " ";
            } else {
                signature += `{${this.outputArgs.join(", ")}} `;
            }
            if (this.inputArgs.length == 1) {
                signature += `${this.name}(${this.inputArgs[0].toString()});`;
            } else {
                signature += `${this.name}(${this.inputArgs.join(", ")});`;
            }
        }
        return signature;
    }
    makeBlog() {
        const pageTitle = document.createElement("title");
        pageTitle.innerText = this.signature;
        document.head.appendChild(pageTitle);

        const content = document.createElement("article");

        let titleElem = document.createElement("h1");
        titleElem.id = "title";
        titleElem.innerText = this.name;
        content.appendChild(titleElem);

        if (this.shortDescription) {
            const shortDescription = document.createElement("p");
            shortDescription.id = "shortDescription";
            shortDescription.innerText = this.shortDescription;
            content.appendChild(shortDescription);
        }

        if (this.signature !== "") {
            let signatureTitle = document.createElement("h3");
            signatureTitle.id = "signatureTitle";
            signatureTitle.innerText = "Signature (C/C++ Style)";
            content.appendChild(signatureTitle);

            let signatureDisplay = document.createElement("code");
            signatureDisplay.id = "signature";
            signatureDisplay.innerText = this.signature;
            content.appendChild(signatureDisplay);
        }

        if (this.desmosURL) {
            let desmosIframe = document.createElement("iframe");
            desmosIframe.id = "desmos";
            desmosIframe.src = this.desmosURL;
            content.appendChild(desmosIframe);
        }

        const textDiv = document.createElement("div");
        textDiv.id = "text";
        this.text = this.text.split("\n");
        for (let paragraph of this.text) {
            let pElem = document.createElement("p");
            pElem.classList.add("paragraph");
            pElem.innerText = paragraph;
            textDiv.appendChild(pElem);
        }
        content.appendChild(textDiv);

        content.id = "content";
        return content;
    }
}

class FuncList {
    constructor(...blogs) {
        this.blogs = blogs;
        this.length = blogs.length;
    }
    makeSidebar() {
        const sideBar = document.createElement("div");
        sideBar.id = "sidebar";

        const searchDiv = document.createElement("div");
        if (isMobile) {
            searchDiv.id = "searchForm";

            const searchBar = document.createElement("input");
            searchBar.type = "text";
            searchBar.placeholder = "Search...";
            searchBar.id = "searchBar";
            searchBar.onchange = function() {
                if (searchBar.value !== "") {
                    location.href = `${baseURL}/Search/?query=${searchBar.value}`;
                }
            }

            const searchButton = new Image();
            searchButton.alt = "Lupe";
            searchButton.src = `${baseURL}/images/Search.png`
            searchButton.id = "searchButton";
            searchButton.onclick = function() {
                if (searchBar.value !== "") {
                    location.href = `${baseURL}/Search/?query=${searchBar.value}`;
                }
            }
            searchDiv.classList.add("sideBarBlog");
            searchDiv.appendChild(searchBar);
            searchDiv.appendChild(searchButton);
            sideBar.appendChild(searchDiv);
        }
        let blog = document.createElement("a");
        blog.classList.add("sideBarBlog");
        const homePage = document.createElement("p");
        homePage.innerText = "Homepage";
        blog.appendChild(homePage);
        blog.href = baseURL;

        if (baseURL.toLowerCase() == location.href.toLowerCase()) {
            blog.id = "currentBlog";
        }
        sideBar.appendChild(blog);

        blog = document.createElement("a");
        blog.classList.add("sideBarBlog");
        const aboutUs = document.createElement("p");
        aboutUs.innerText = "About me / About this";
        blog.appendChild(aboutUs);
        blog.href = `${baseURL}/aboutme/`;

        if (`${baseURL}/aboutme/`.toLowerCase() == location.href.toLowerCase()) {
            blog.id = "currentBlog";
        }
        sideBar.appendChild(blog);

        for (let pastBlog of this.blogs) {
            let blog = document.createElement("a");
            blog.classList.add("sideBarBlog");
            if (`${baseURL}/${pastBlog.name}/`.toLowerCase() == location.href.toLowerCase()) {
                blog.id = "currentBlog";
            }
            blog.href = `${baseURL}/${pastBlog.name}/`;

            let pElem = document.createElement("p");
            pElem.innerText = pastBlog.name;
            blog.appendChild(pElem);
            sideBar.appendChild(blog);
        }
        return sideBar
    }
    makeLandingPage() {
        const content = document.createElement("article");
        content.id = "content";

        let titleElem = document.createElement("h1");
        titleElem.innerText = "Applescript Math Library Documentation";
        titleElem.id = "title";
        content.appendChild(titleElem);

        const blogs = document.createElement("div");
        blogs.id = "blogs";

        for (let pastBlog of this.blogs) {
            let containingDiv = document.createElement("a");
            containingDiv.id = pastBlog.name;

            let blogTitle = document.createElement("h3");
            blogTitle.innerText = pastBlog.name;
            blogTitle.classList.add("blogTitle");

            let blogImg;
            if (pastBlog.desmosURL) {
                blogImg = document.createElement("iframe");
                blogImg.src = `${pastBlog.desmosURL}?embed`;
                blogImg.classList.add("blogImg");
            }

            let blogDescription = document.createElement("p");
            blogDescription.innerText = pastBlog.shortDescription;
            blogDescription.classList.add("blogDescription");

            containingDiv.classList.add("blog");
            containingDiv.href = `${baseURL}/${pastBlog.name}/`;

            containingDiv.appendChild(blogTitle);
            if (pastBlog.desmosURL) {
                containingDiv.appendChild(blogImg);
            }
            containingDiv.appendChild(blogDescription);
            blogs.appendChild(containingDiv);
        }
        content.appendChild(blogs);
        return content;
    }
    findBlog(text) {
        return this.blogs.find(Blog => Blog.name.toLowerCase() == text.toLowerCase());
    }
    makeSearch(query) {
        if (query === null) {
            let content = document.createElement("div");
            content.id = "content";

            const title = document.createElement("h1");
            title.innerText = `Search`
            title.id = "title";
            content.appendChild(title);

            const searchDiv = document.createElement("div");
            searchDiv.id = "bigSearchForm";

            const searchBar = document.createElement("input");
            searchBar.type = "text";
            searchBar.placeholder = "Search...";
            searchBar.id = "bigSearchBar";
            searchBar.value = query;
            searchBar.onchange = function() {
                if (searchBar.value !== "") {
                    location.href = `${baseURL}/Search/?query=${searchBar.value}`;
                }
            }

            const searchButton = new Image();
            searchButton.alt = "Magnifier";
            searchButton.src = `${baseURL}/images/Search.png`
            searchButton.id = "bigSearchButton";
            searchButton.onclick = function() {
                if (searchBar.value !== "") {
                    location.href = `${baseURL}/Search/?query=${searchBar.value}`;
                }
            }

            searchDiv.appendChild(searchBar);
            searchDiv.appendChild(searchButton);

            content.appendChild(searchDiv);

            return content;
        }

        let originalQuery = query;
        query = query.toString().toLowerCase();

        let rickroll = false;

        if (query == "pride") {
            setTimeout(_ => [...document.querySelectorAll("#header, #footer, #sidebar")].forEach(x => {
                x.classList.add("pride");
            }), 100);
        } else if (query == "rick astley" || query == "never gonna give you up" || query == "rickroll") {
            rickroll = true;
        }

        let foundBlogs = new Set();
        for (let blog of this.blogs) {
            for (let key in blog) {
                let value = blog[key];
                if (value.constructor == Object) {
                    for (let key1 in value) {
                        let value1 = value[key1];
                        if (value1.toString().toLowerCase().includes(query)) {
                            foundBlogs.add(blog);
                        }
                    }
                } else if (value.constructor == Array) {
                    for (let item of value) {
                        if (item.toString().toLowerCase().includes(query)) {
                            foundBlogs.add(blog);
                        }
                    }
                } else {
                    if (value.toString().toLowerCase().includes(query)) {
                        foundBlogs.add(blog);
                    }
                }
            }
        }

        foundBlogs = [...foundBlogs];

        if (rickroll) {
            foundBlogs = this.blogs;
        }

        let content = document.createElement("div");
        content.id = "content";

        const title = document.createElement("h1");
        title.innerText = `Search for '${originalQuery}' resulted in ${foundBlogs.length} Matches.`
        title.id = "title";
        content.appendChild(title);

        const searchDiv = document.createElement("div");
        searchDiv.id = "bigSearchForm";

        const searchBar = document.createElement("input");
        searchBar.type = "text";
        searchBar.placeholder = "Search...";
        searchBar.id = "bigSearchBar";
        searchBar.value = originalQuery;
        searchBar.onchange = function() {
            if (searchBar.value !== "") {
                location.href = `${baseURL}/Search/?query=${searchBar.value}`;
            }
        }

        const searchButton = new Image();
        searchButton.alt = "Lupe";
        searchButton.src = `${baseURL}/images/Search.png`
        searchButton.id = "bigSearchButton";
        searchButton.onclick = function() {
            if (searchBar.value !== "") {
                location.href = `${baseURL}/Search/?query=${searchBar.value}`;
            }
        }

        searchDiv.appendChild(searchBar);
        searchDiv.appendChild(searchButton);

        content.appendChild(searchDiv);
        for (let foundBlog of foundBlogs) {
            let blogBox = document.createElement("a");
            blogBox.classList.add("foundBlog");
            blogBox.innerText = foundBlog.name;
            if (rickroll) {
                blogBox.href = "https://www.youtube.com/watch?v=xvFZjo5PgG0";
            } else {
                blogBox.href = `${baseURL}/${foundBlog.name}/`;
            }

            content.appendChild(blogBox);
        }

        return content;
    }
}

const isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;


const functions = new FuncList(
    new Func("sin", '', 'Returns the sine of a given angle in radians', ['double'], ["double"], "https://www.desmos.com/calculator/sgmcsg4u2z"),
    new Func("cos", '', 'Returns the cosine of a given angle in radians', ['double'], ["double"], "https://www.desmos.com/calculator/ozxaiwycbh"),
    new Func("tan", '', 'Returns the tangent of a given angle in radians', ['double'], ["double"], "https://www.desmos.com/calculator/u8qs9lestd"),
    new Func("asin", '', 'Returns the arcsine of a number', ['double'], ["double"], "https://www.desmos.com/calculator/jugpkslmpd"),
    new Func("acos", '', 'Returns the arc cosine of a number', ['double'], ["double"], "https://www.desmos.com/calculator/shqmao2yvi"),
    new Func("atan", '', 'Returns the arc tangent of a number', ['double'], ["double"], "https://www.desmos.com/calculator/o4kwijkdjv"),
    new Func("sinh", '', 'Returns the sine of a given angle in radians in hyperbolic space', ['double'], ["double"], "https://www.desmos.com/calculator/w7jdl7tedb"),
    new Func("cosh", '', 'Returns the cosine of a given angle in radians in hyperbolic space', ['double'], ["double"], "https://www.desmos.com/calculator/e7mlowpfy2"),
    new Func("tanh", '', 'Returns the tangent of a given angle in radians in hyperbolic space', ['double'], ["double"], "https://www.desmos.com/calculator/46lqcc0fdk"),
    new Func("asinh", '', 'Returns the arcsine of a number in hyperbolic space', ['double'], ["double"], "https://www.desmos.com/calculator/ka5hll4sl6"),
    new Func("acosh", '', 'Returns the arc cosine of a number in hyperbolic space', ['double'], ["double"], "https://www.desmos.com/calculator/dvbbj4y6vv"),
    new Func("atanh", '', 'Returns the arc tangent of a number in hyperbolic space', ['double'], ["double"], "https://www.desmos.com/calculator/igpa1m0471"),
    new Func("atan2", '', 'Returns the arc tangent of y/x', ['double'], ["double", "double"], "https://www.desmos.com/calculator/cfdxyaklqd"),
    new Func("sqrt", '', 'Returns the square root of a positive number', ['double'], ["double"], "https://www.desmos.com/calculator/get7idmi8b"),
    new Func("cbrt", '', 'Returns the cube root of a number', ['double'], ["double"], "https://www.desmos.com/calculator/f1mjqwdtps"),
    new Func("exp", '', 'Returns e to the power of a given number', ['double'], ["double"], "https://www.desmos.com/calculator/no46qkmoil"),
    new Func("expm1", '', 'Returns e to the power of a given number and subtracts 1', ['double'], ["double"], "https://www.desmos.com/calculator/n3opzqx6js"),
    new Func("ceil", '', 'Returns the closest bigger integer', ['int'], ["double"], "https://www.desmos.com/calculator/fhvzceacfp"),
    new Func("floor", '', 'Returns the closest smaller integer', ['int'], ["double"], "https://www.desmos.com/calculator/gaxkcmhlrp"),
    new Func("trunc", '', 'Returns the closest integer that is smaller than the absolute value of a given number', ['int'], ["double"], "https://www.desmos.com/calculator/jtgttyrtkz"),
    new Func("roundx", '', 'Returns the nearest integer', ['int'], ["double"], "https://www.desmos.com/calculator/iowsenfzun"),
    new Func("sign", '', 'Returns 1 if positive, -1 if negative and 0 if 0', ['int'], ["double"], "https://www.desmos.com/calculator/uiqmkamocj"),
    new Func("pow", '', 'Returns a number raised to the power of another', ['double'], ["double", "double"], "https://www.desmos.com/calculator/ewdaz3wsud"),
    new Func("abs", '', 'Returns the absolute value of a number', ['double'], ["union any"], "https://www.desmos.com/calculator/cnmfrjljvq"),
    new Func("log1p", '', 'Returns the log base e of a 1 + a number', ['double'], ["double"], "https://www.desmos.com/calculator/onyrs3jmgd"),
    new Func("log2", '', 'Returns the log base 2 of a number', ['double'], ["double"], "https://www.desmos.com/calculator/0bpxdnmuf7"),
    new Func("log10", '', 'Returns the log base 10 of a number', ['double'], ["double"], "https://www.desmos.com/calculator/kbwvjnuupl"),
    new Func("ln", '', 'Returns the log base e of a number', ['double'], ["double"], "https://www.desmos.com/calculator/uvnfyqjy1c"),
    new Func("logb", '', 'Returns the log b of a given number', ['double'], ["double", "double"], "https://www.desmos.com/calculator/hbaijmbnwf"),
    new Func("min", '', 'Returns the smallest number in a list of numbers', ['double'], ["array<double>"], "https://www.desmos.com/calculator/gnwlxtpxqv"),
    new Func("max", '', 'Returns the biggest number in a list of numbers', ['double'], ["array<double>"], "https://www.desmos.com/calculator/3hiiegml2e"),
    new Func("random", '', 'Returns a random number between 0 and 1', ['double'], [], "https://www.desmos.com/calculator/ihmoodlcta"),
    new Func("factorial", '', 'Returns the factorial of an integer', ['int'], ["int"], "https://www.desmos.com/calculator/llbwdi2ong"),
    new Func("comb", '', 'Returns the number of ways to choose the second given number of items from the first given number of items without repetition and without order', ['int'], ["int", "int"], "https://www.desmos.com/calculator/sg0ew2q0v5"),
    new Func("perm", '', 'Returns the number of ways to choose the second given number of items from the first given number of items without repetition and with order', ['int'], ["int", "int"], "https://www.desmos.com/calculator/hcm1qo7w6a"),
    new Func("copysign", '', 'Copies the sign of the second given number to the first', ['double'], ["double", "double"], "https://www.desmos.com/calculator/vs92qt93zl"),
    new Func("dist", '', 'Calculates the distance between two n-dimensional points', ['double'], ["array<double>", "array<double>"], "https://www.desmos.com/calculator/bmjs2snsjw"),
    new Func("erf", '', 'Returns the error-function value of a given number', ['double'], ["double"], "https://www.desmos.com/calculator/1zds1baik8"),
    new Func("erfc", '', 'Returns 1-erf of a given number', ['double'], ["double"], "https://www.desmos.com/calculator/uoalsd4bqz"),
    new Func("fabs", '', 'Returns the absolute value of a number as a real', ['double'], ["union any"], "https://www.desmos.com/calculator/enljik7kyy"),
    new Func("fmod", '', 'Returns the remainder of a given number divided by another', ['double'], ["double", "double"], "https://www.desmos.com/calculator/6odylscumk"),
    new Func("fsum", '', 'Returns the sum of a given list of numbers', ['double'], ["array<double>"], "https://www.desmos.com/calculator/beamjobpc3"),
    new Func("gamma", '', 'Returns the gamma-function value of a given number', ['double'], ["double"], "https://www.desmos.com/calculator/hrop5bmrc5"),
    new Func("lgamma", '', 'Returns the natural logarithm of the gamma-function value of a given number', ['double'], ["double"], "https://www.desmos.com/calculator/iche5hjkim"),
    new Func("gcd", '', 'Returns the greatest common divisor of two numbers', ['int'], ["int", "int"], "https://www.desmos.com/calculator/ixgvwdsurq"),
    new Func("hypot", '', 'Returns the euclidian norm or the hypotenuse', ['double'], ["array<double>"], "https://www.desmos.com/calculator/xnc8da2urp"),
    new Func("isclose", '', 'Decides if two numbers are close', ['bool'], ["double", "double", "double", "double"], "https://www.desmos.com/calculator/gvsgkfj6xw"),
    new Func("isqrt", '', 'Returns the next lower square root', ['int'], ["double"], "https://www.desmos.com/calculator/3amqyowcs5"),
    new Func("ldexp", '', 'Returns the first number raised to the power of twice the second number', ['double'], ["double", "double"], "https://www.desmos.com/calculator/pytvb3871y"),
    new Func("prod", '', 'Returns the product of a given list of numbers', ['double'], ["array<double>"], "https://www.desmos.com/calculator/ksvy8xhqvo"),
    new Func("radians", '', 'Converts an angle from degrees to radians', ['double'], ["double"], "https://www.desmos.com/calculator/d6wwwuffsw"),
    new Func("degrees", '', 'Converts an angle from radians to degrees', ['double'], ["double"], "https://www.desmos.com/calculator/xkujzfpkpb"),
    new Func("clz32", '', 'Returns the number of leading zero bits in the 32-bit binary representation of a number', ['int'], ["double"], "https://www.desmos.com/calculator/3qqvbkdilj"),
    new Func("imul", '', 'Returns the result of integer multiplication of two numbers', ['int'], ["double", "double"], "https://www.desmos.com/calculator/ml1d5rmsov"),
    new Func("fround", '', 'Does nothing, do not use.', ['double'], ["double"], "https://www.desmos.com/calculator/t243tf9qfs"),
    new Func("modf", '', 'Returns a tuple with the decimal and integer part of a given number separated', ['double', 'int'], ["double"], "https://www.desmos.com/calculator/aqd3wexrwy"),
    new Func("remainder", '', 'Returns the IEEE 754-style remainder of two given numbers', ['double'], ["double", "double"], "https://www.desmos.com/calculator/pbsnntqklc"),
    new Func("frexp", '', 'Returns the opposite of ldexp', ['double', 'double'], ["double"], "Null"),
    new Func("isfinite", '', 'Decides if a number is finite', ['bool'], ["double"], "https://www.desmos.com/calculator/gt8u0xoaeg"),
    new Func("isinf", '', 'Decides if a number is infinite', ['bool'], ["double"], "https://www.desmos.com/calculator/41bfjdapjj"),
)

if (typeof structuredClone === "undefined") {
    function structuredClone(obj) {
        const oldState = history.state;
        history.replaceState(obj, null);
        const clonedObj = history.state;
        history.replaceState(oldState, null);
        return clonedObj;
    }
}

if (typeof String.prototype.replaceAll == "undefined") {
    String.prototype.replaceAll = function(find, replace) {
        x = structuredClone(this)
        while (x.includes("find")) {
            x = x.replace(find, replace);
        }
        return x;
    }
}

if (typeof Array.prototype.at == "undefined") {
    Array.prototype.at = function(index) {
        if (index < 0) {
            return this[this.length + index]
        } else {
            return this[index];
        }
    }
}

Number.prototype.clamp = function(min, max) {
    return (this >= max ? max : (this <= min ? min : Number(this)))
}

function makeTableOfContentsRow(text, id, name) {
    let tableRow = document.createElement("tr");
    let tableData = document.createElement("td");
    tableData.innerHTML = `<a href=${baseURL}/${name}/#${id}>${text}</a>`;
    tableRow.appendChild(tableData);
    return tableRow;
}

function toggleDarkmode(initial) {
    const body = document.body;
    const Tables = document.querySelectorAll("#content table *");
    const textElems = document.querySelectorAll("#content > p, #content > td, #content > th, #content > a");
    const blogs = document.getElementsByClassName("blog");
    const elemsToSwitch = [...Tables, ...textElems, ...blogs, body];
    if (!elemsToSwitch[0].classList.contains("animate") && !initial) {
        elemsToSwitch.forEach(x => x.classList.add("animate"))
    }
    if ((localStorage.getItem("mode") == "dark" && !initial) || (localStorage.getItem("mode") == "bright" && initial)) {
        localStorage.setItem("mode", "bright")
        elemsToSwitch.forEach(x => {
            x.classList.remove("dark")
            x.classList.add("bright")
        });
    } else if ((localStorage.getItem("mode") == "bright" && !initial) || (localStorage.getItem("mode") == "dark" && initial)) {
        localStorage.setItem("mode", "dark");
        elemsToSwitch.forEach(x => {
            x.classList.remove("bright")
            x.classList.add("dark")
        });
    } else {
        localStorage.setItem("mode", "bright")
        elemsToSwitch.forEach(x => {
            x.classList.remove("dark")
            x.classList.add("bright")
        });
    }
}

function collapseSidebar() {
    const sideBar = document.getElementById("sidebar");
    const content = document.getElementById("content");
    const footer = document.getElementById("footer");
    const elemsToSwitch = [sideBar, content, footer];
    if (sideBar.classList.contains("active")) {
        elemsToSwitch.forEach(x => {
            x.classList.remove("active")
            x.classList.add("inactive");
        })
    } else if (sideBar.classList.contains("inactive")) {
        elemsToSwitch.forEach(x => {
            x.classList.remove("inactive")
            x.classList.add("active");
        })
    } else {
        elemsToSwitch.forEach(x => {
            x.classList.add("active");
        })
    }
}

function isURL(URL) {
    return URL.slice(0, 8) == "https://" || URL.slice(0, 7) == "http://"
}

function makeHeader() {
    const headerElem = document.createElement("nav");
    headerElem.id = "header";

    const logoWrapper = document.createElement("a");
    logoWrapper.href = baseURL;
    const logo = new Image;
    logo.id = "logo";
    logo.src = `${baseURL}/images/Logo.svg`;
    logo.alt = "Return to Homepage";
    logoWrapper.appendChild(logo);

    const collapseSidebarElem = new Image();
    collapseSidebarElem.alt = "collapse sidebar button";
    collapseSidebarElem.id = "collapseSidebar";
    collapseSidebarElem.src = `${baseURL}/images/menucollapse.png`;
    collapseSidebarElem.onclick = collapseSidebar;

    const searchDiv = document.createElement("div");
    if (!isMobile) {
        searchDiv.id = "searchForm";

        const searchBar = document.createElement("input");
        searchBar.type = "text";
        searchBar.placeholder = "Search...";
        searchBar.id = "searchBar";
        searchBar.onchange = function() {
            if (searchBar.value !== "") {
                location.href = `${baseURL}/Search/?query=${searchBar.value}`;
            }
        }

        const searchButton = new Image();
        searchButton.alt = "Lupe";
        searchButton.src = `${baseURL}/images/Search.png`
        searchButton.id = "searchButton";
        searchButton.onclick = function() {
            if (searchBar.value !== "") {
                location.href = `${baseURL}/Search/?query=${searchBar.value}`;
            }
        }

        searchDiv.appendChild(searchBar);
        searchDiv.appendChild(searchButton);
    }

    const darkModeToggle = new Image();
    darkModeToggle.id = "darkModeToggle";
    darkModeToggle.alt = "Toggle Dark Mode"
    darkModeToggle.src = `${baseURL}/images/mode-toggle.png`
    darkModeToggle.onclick = function() {
        toggleDarkmode(false);
    }

    headerElem.appendChild(collapseSidebarElem);
    headerElem.appendChild(logoWrapper);

    if (!isMobile) {
        headerElem.appendChild(searchDiv);
    }

    headerElem.appendChild(darkModeToggle);
    return headerElem;
}

const faviconText = `<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22 style=%22fill:white%22></text></svg>">`;

function makeFooter() {
    const footer = document.createElement("footer");
    footer.id = "footer";

    const contact = document.createElement("a");
    contact.innerText = "Contact me";
    contact.target = "_blank";
    contact.href = "mailto:gian.zellweger@ict-scouts.ch";

    const source = document.createElement("a");
    source.innerText = "Source code";
    source.target = "_blank";
    source.id = "source";

    const github = document.createElement("a");
    github.innerText = "My Github";
    github.target = "_blank"
    github.id = "github";

    source.href = "https://github.com/gianzellweger/applescriptMath";
    github.href = "https://github.com/gianzellweger";

    footer.appendChild(contact);
    footer.appendChild(source);
    footer.appendChild(github);
    return footer
}

function makeRatingTable(dict) {
    if (dict.constructor != Object) {
        console.error("Bewärtige mönn als {Object} formattiert si.")
    }
    const Table = document.createElement("table");
    const Tbody = document.createElement("tbody");
    const Thead = document.createElement("thead");
    let RatingHeadText = document.createElement("th");
    RatingHeadText.innerText = "Kriterien";
    Thead.appendChild(RatingHeadText);
    let RatingHeadValues = document.createElement("th");
    RatingHeadValues.innerText = "Bewertung";
    Thead.appendChild(RatingHeadValues);
    for (let criteria in dict) {
        currentVal = dict[criteria];
        if (currentVal.constructor != Number) {
            console.error("Bewärtige mönn nummere si.")
        }
        currentVal = currentVal.clamp(0, 5)
        let tableRow = document.createElement("tr");
        let criteriaName = document.createElement("td");
        criteria = criteria.replaceAll("_", " ").replaceAll("ç", "-");
        criteriaName.innerText = criteria;
        let criteriaValue = document.createElement("td");
        for (var i = 1; i <= currentVal; i++) {
            let newImg = new Image();
            newImg.loading = "lazy";
            newImg.src = `${baseURL}/images/full-star.png`;
            newImg.classList.add("star");
            newImg.alt = "star";
            criteriaValue.appendChild(newImg)
        }
        if (!Number.isInteger(currentVal)) {
            let newImg = new Image();
            newImg.loading = "lazy";
            newImg.src = `${baseURL}/images/half-star.png`;
            newImg.classList.add("star");
            newImg.alt = "star";
            criteriaValue.appendChild(newImg);
        }
        for (var i = currentVal; i <= 4; i++) {
            let newImg = new Image();
            newImg.loading = "lazy";
            newImg.src = `${baseURL}/images/empty-star.png`;
            newImg.classList.add("star");
            newImg.alt = "star";
            criteriaValue.appendChild(newImg);
        }
        tableRow.appendChild(criteriaName);
        tableRow.appendChild(criteriaValue);
        Tbody.appendChild(tableRow);
    }
    Table.appendChild(Thead);
    Table.appendChild(Tbody);
    return Table;
}

function makeInfoBox(dict) {
    if (dict.constructor != Object) {
        console.error("D'Infobox muess als {Object} formattiert si.")
    }
    const Table = document.createElement("table");
    const Tbody = document.createElement("tbody");
    for (let info in dict) {
        let tableRow = document.createElement("tr");
        let infoName = document.createElement("td");
        infoName.classList.add("infoName")
        info = info.replaceAll("_", " ").replaceAll("ç", "-")
        infoName.innerText = info;
        let infoValue = document.createElement("td");
        infoValue.classList.add("infoValue");
        if (info == "Website") {
            let aElem = document.createElement("a");
            aElem.href = dict[info];
            aElem.target = "_blank";
            aElem.innerText = dict[info];
            infoValue.appendChild(aElem);
        } else if (info == "Email") {
            let aElem = document.createElement("a");
            aElem.href = `mailto:${dict[info]}`;
            aElem.target = "_blank";
            aElem.innerText = dict[info];
            infoValue.appendChild(aElem);
        } else {
            infoValue.innerText = dict[info];
        }
        tableRow.appendChild(infoName);
        tableRow.appendChild(infoValue);
        Tbody.appendChild(tableRow);
    }
    Table.appendChild(Tbody);
    return Table;
}

function makeOpeningTimes(openingTimes) {
    if (openingTimes.constructor != Object) {
        console.error("D'Öffnigszite mien als {Object} formattiert si.");
    }
    const containingDiv = document.createElement("div");

    const openingTimesTitle = document.createElement("h3");
    openingTimesTitle.innerText = "Öffnungszeiten";
    openingTimesTitle.id = "openingTimesTitle"
    containingDiv.appendChild(openingTimesTitle);

    const Table = document.createElement("table");
    const Tbody = document.createElement("tbody");

    for (let openingTimeElem in openingTimes) {
        let tableRow = document.createElement("tr");
        let openingDays = document.createElement("td");
        openingDays.classList.add("openingDays");
        openingDays.innerText = openingTimeElem.replaceAll("_", " ").replaceAll("ç", "-");
        let openingTime = document.createElement("td");
        openingTime.classList.add("openingTime");
        openingTime.innerText = openingTimes[openingTimeElem];
        tableRow.appendChild(openingDays);
        tableRow.appendChild(openingTime);
        Tbody.appendChild(tableRow);
    }
    Table.appendChild(Tbody);
    Table.id = "openingTimesTable";
    containingDiv.appendChild(Table)
    return containingDiv;
}

function checkMap() {
    if (typeof document.getElementById("map") != "undefined") {
        setTimeout(_ => console.log("Loading map again..."), 1000);
        if (document.getElementById("map").childElementCount == 0) {
            initMap();
        }
    }
}