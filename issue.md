Prevent XSS: Automatically escape HTML in template interpolations

Category: Security Vulnerability / Core Renderer
Description: In TemplateRenderer, interpolation values matching {{ expression }} are directly cast to strings and appended to the rendered HTML template.

Since Avenx-JS parses and patches this HTML into the DOM inside DomPatcher, any user-supplied input containing raw HTML tags or attributes (such as <img src=x onerror=alert(1)>) will be executed in the browser context. Although HtmlEscaper and Sanitizer are implemented, they are not integrated into the runtime templates.

Impact: High vulnerability to Cross-Site Scripting (XSS).

Proposed Solution:

Modify TemplateRenderer.render to automatically escape values using HtmlEscaper.escape by default.
Support a safe wrapper or a raw interpolation syntax (e.g., {{{ expression }}} or a html(...) helper) when raw HTML is explicitly required.
