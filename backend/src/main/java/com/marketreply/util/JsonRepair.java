package com.marketreply.util;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.regex.Pattern;

/**
 * Best-effort repair of JSON that was cut off mid-way (for example when an LLM
 * hits its output-token limit). It closes open strings, arrays and objects and
 * removes dangling keys / commas / half-written literals so that Jackson can
 * still read whatever fields were fully generated.
 *
 * Pure Java - no third-party dependencies.
 */
public final class JsonRepair {

    private static final Pattern NUMBER = Pattern.compile("-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?");

    private JsonRepair() {
    }

    public static String repairTruncatedJson(String json) {
        if (json == null) {
            return null;
        }

        StringBuilder out = new StringBuilder(json.length() + 8);
        Deque<Character> stack = new ArrayDeque<>();
        boolean inString = false;
        boolean escaped = false;

        for (int i = 0; i < json.length(); i++) {
            char c = json.charAt(i);
            out.append(c);
            if (inString) {
                if (escaped) {
                    escaped = false;
                } else if (c == '\\') {
                    escaped = true;
                } else if (c == '"') {
                    inString = false;
                }
                continue;
            }
            if (c == '"') {
                inString = true;
            } else if (c == '{') {
                stack.push('}');
            } else if (c == '[') {
                stack.push(']');
            } else if ((c == '}' || c == ']') && !stack.isEmpty()) {
                stack.pop();
            }
        }

        if (inString) {
            if (escaped) {
                out.setLength(out.length() - 1);
            }
            out.append('"');
        }

        while (true) {
            rtrim(out);
            if (out.length() == 0) {
                break;
            }
            char last = out.charAt(out.length() - 1);

            if (last == ',') {
                out.setLength(out.length() - 1);
                continue;
            }
            if (last == ':') {
                out.setLength(out.length() - 1);
                rtrim(out);
                int open = openingQuote(out);
                if (open >= 0) {
                    out.setLength(open);
                }
                continue;
            }
            if (last == '"') {
                if (!stack.isEmpty() && stack.peek() == '}') {
                    int open = openingQuote(out);
                    if (open >= 0 && isKeyPosition(out, open)) {
                        out.setLength(open);
                        continue;
                    }
                }
                break;
            }
            if (isLiteralChar(last)) {
                int s = out.length();
                while (s > 0 && isLiteralChar(out.charAt(s - 1))) {
                    s--;
                }
                String token = out.substring(s);
                if (isCompleteLiteral(token)) {
                    break;
                }
                out.setLength(s);
                continue;
            }
            break;
        }

        while (!stack.isEmpty()) {
            out.append(stack.pop());
        }
        return out.toString();
    }

    private static void rtrim(StringBuilder sb) {
        int len = sb.length();
        while (len > 0 && Character.isWhitespace(sb.charAt(len - 1))) {
            len--;
        }
        sb.setLength(len);
    }

    private static int openingQuote(StringBuilder sb) {
        int end = sb.length() - 1;
        if (end < 0 || sb.charAt(end) != '"') {
            return -1;
        }
        for (int j = end - 1; j >= 0; j--) {
            if (sb.charAt(j) == '"') {
                int backslashes = 0;
                for (int k = j - 1; k >= 0 && sb.charAt(k) == '\\'; k--) {
                    backslashes++;
                }
                if (backslashes % 2 == 0) {
                    return j;
                }
            }
        }
        return -1;
    }

    private static boolean isKeyPosition(StringBuilder sb, int openQuote) {
        int p = openQuote - 1;
        while (p >= 0 && Character.isWhitespace(sb.charAt(p))) {
            p--;
        }
        return p >= 0 && (sb.charAt(p) == ',' || sb.charAt(p) == '{');
    }

    private static boolean isLiteralChar(char c) {
        return Character.isLetterOrDigit(c) || c == '.' || c == '-' || c == '+';
    }

    private static boolean isCompleteLiteral(String token) {
        return token.equals("true") || token.equals("false") || token.equals("null")
                || NUMBER.matcher(token).matches();
    }
}