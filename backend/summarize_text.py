import os
from azure.ai.textanalytics import TextAnalyticsClient, ExtractiveSummaryAction
from azure.core.credentials import AzureKeyCredential
import logging

logging.basicConfig(level=logging.INFO)

def authenticate_client():
    key = "5c3e538d40c147a481683807027c1984"  # INPUT_REQUIRED {Azure Text Analytics subscription key}
    endpoint = "https://blessing.cognitiveservices.azure.com/"  # INPUT_REQUIRED {Azure Text Analytics endpoint}
    ta_credential = AzureKeyCredential(key)
    text_analytics_client = TextAnalyticsClient(endpoint=endpoint, credential=ta_credential)
    return text_analytics_client

def summarize_text(client, input_file_path):
    try:
        with open(input_file_path, 'r', encoding='utf-8') as file:
            text_content = file.read()

        poller = client.begin_analyze_actions(
            documents=[text_content],
            actions=[
                ExtractiveSummaryAction(max_sentence_count=4)
            ],
            polling_interval=5,
        )
        result = poller.result()

        summary_text = ""
        for doc in result:
            for summary in doc:
                if not summary.is_error:
                    summary_text += " ".join([sentence.text for sentence in summary.sentences]) + " "
                    logging.info(f"Summary extracted: \n{summary_text}")
                else:
                    logging.error(f"Error summarizing document: {summary.code} - {summary.message}")
        return summary_text.strip()
    except Exception as e:
        logging.error(f"An error occurred during summarization: {e}", exc_info=True)
        return ""

if __name__ == "__main__":
    # Example usage - replace 'path/to/transcript.txt' with actual path
    client = authenticate_client()
    input_file_path = "transcript_BACK_FROM_HOLIDAY_EDIT_20a___NEW_OPEN_TITLE___WITH_DRUM_SHOT__NEW_VO_C_SNIFF_END_NO_SLATE_1.txt"  # INPUT_REQUIRED {path to the transcript file}
    summary_text = summarize_text(client, input_file_path)
    if summary_text:
        logging.info(f"Summary: \n{summary_text}")
    else:
        logging.error("Failed to generate summary.")