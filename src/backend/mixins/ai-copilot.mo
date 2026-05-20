import Outcall "mo:caffeineai-http-outcalls/outcall";
import Text "mo:core/Text";
import Char "mo:core/Char";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";

mixin () {
  var geminiApiKey : Text = "AIzaSyAmhmQ2t-Y0ZfzxzwiEWIKvxRmZIwURfJg";

  let systemPrompt : Text = "You are InfraOS AI Copilot, a high-level infrastructure intelligence system for the Indian government (NHAI/MoRTH). You have access to real-time project data across India. Your goal is to help officials with procurement, execution monitoring, risk assessment, and executive briefing. Be concise, formal yet insightful, and always base your answers on infrastructure logic. If asked about a specific project not in context, mention you are fetching the latest satellite data from the National Asset Hub.";

  public query func transform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  public func setGeminiApiKey(key : Text) : async () {
    geminiApiKey := key;
  };

  public func generateAIInsight(prompt : Text) : async Text {
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" # geminiApiKey;

    let escapedPrompt = escapeJson(prompt);
    let escapedSystem = escapeJson("You are InfraOS AI Copilot, a high-level infrastructure intelligence assistant for Indian government officials (NHAI/MoRTH). You help with procurement analysis, project execution monitoring, risk assessment, delay prediction, and executive briefing on National Infrastructure Pipeline. You can also answer general knowledge questions, greetings, and any other topic — just note your specialty is Indian infrastructure. Always respond in a formal yet helpful tone. Never mention Gemini or Google in your responses.");
    let requestBody = "{\"system_instruction\":{\"parts\":[{\"text\":\"" # escapedSystem # "\"}]},\"contents\":[{\"parts\":[{\"text\":\"" # escapedPrompt # "\"}]}]}";

    let responseText = await Outcall.httpPostRequest(
      url,
      [{ name = "Content-Type"; value = "application/json" }],
      requestBody,
      transform,
    );
    extractGeminiText(responseText);
  };

  // Extract candidates[0].content.parts[0].text from Gemini JSON response
  func extractGeminiText(json : Text) : Text {
    let marker = "\"text\":\"";
    switch (findAndExtract(json, marker)) {
      case (?t) {
        if (t.size() > 0) { t }
        else { Runtime.trap("InfraOS AI Copilot: empty response from intelligence layer") };
      };
      case null { Runtime.trap("InfraOS AI Copilot: could not parse response") };
    };
  };

  // Find marker in text and extract the quoted string value after it
  func findAndExtract(body : Text, search : Text) : ?Text {
    let bodyChars = body.toArray();
    let searchChars = search.toArray();
    let bodyLen = bodyChars.size();
    let searchLen = searchChars.size();
    if (searchLen == 0 or bodyLen < searchLen) return null;

    label searchLoop for (i in Nat.range(0, bodyLen - searchLen + 1)) {
      var matches = true;
      label matchCheck for (j in Nat.range(0, searchLen)) {
        if (bodyChars[i + j] != searchChars[j]) {
          matches := false;
          break matchCheck;
        };
      };
      if (matches) {
        var result = "";
        var k = i + searchLen;
        label extractLoop while (k < bodyLen) {
          let c = bodyChars[k];
          if (c.toNat32() == 34) break extractLoop;
          result := result # c.toText();
          k := k + 1;
        };
        return ?result;
      };
    };
    return null;
  };

  func unescapeJson(text : Text) : Text {
    text; // Already unescaped in findAndExtract
  };

  func escapeJson(text : Text) : Text {
    var result = "";
    for (c in text.toIter()) {
      let cp = c.toNat32();
      if (cp == 34) { result #= "\\\""; }      // double quote
      else if (cp == 92) { result #= "\\\\"; } // backslash
      else if (cp == 10) { result #= "\\n"; }  // newline
      else if (cp == 9) { result #= "\\t"; }   // tab
      else if (cp == 13) { result #= "\\r"; }  // carriage return
      else { result #= Text.fromChar(c); };
    };
    result;
  };
};
