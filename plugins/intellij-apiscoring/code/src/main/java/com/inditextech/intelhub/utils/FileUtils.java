package com.inditextech.intelhub.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

import com.inditextech.intelhub.dto.ApiDto;
import com.inditextech.intelhub.dto.EventRequestDto;
import com.inditextech.intelhub.dto.Metadata;
import com.inditextech.intelhub.dto.MetadataDto;
import com.inditextech.intelhub.exception.CustomRuntimeException;
import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.editor.*;
import com.intellij.openapi.fileEditor.FileEditorManager;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.util.Computable;
import com.intellij.openapi.vfs.VirtualFile;
import com.intellij.psi.PsiFile;
import com.intellij.psi.search.FilenameIndex;
import com.intellij.psi.search.GlobalSearchScope;
import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class FileUtils {

    private FileUtils() {
        // empty
    }

    @NotNull
    public static String compressProject(Project project, Path selectedFolderPath, Metadata metadata) {
        String zipFileName = String.valueOf(Paths.get(System.getProperty("java.io.tmpdir"), String.format("intellij360-%s.zip", new Date().getTime())));

        try (FileOutputStream fos = new FileOutputStream(zipFileName);
            ZipOutputStream zipOut = new ZipOutputStream(fos)) {
            File directory = selectedFolderPath != null ? new File(selectedFolderPath.toString()) : new File(FileUtils.getRootPath(project));
            List<String> apiDefinitionsPaths = metadata.getApis()
                .stream().map(ApiDto::getDefinitionPath)
                .map(s -> Paths.get(directory.getPath(), s).normalize().toString())
                .collect(Collectors.toList());
            FileUtils.zipFile(directory, apiDefinitionsPaths, directory.getName(), zipOut);
        } catch (IOException ex) {
            throw new CustomRuntimeException(ex);
        }
        return zipFileName;
    }
    public static void zipFile(File fileToZip, List<String> apiDefinitionsPaths, String fileName, ZipOutputStream zipOut) throws IOException {
        if (fileToZip.isHidden()) {
            return;
        }
        if (fileToZip.isDirectory()) {
            if (fileName.endsWith("/")) {
                zipOut.putNextEntry(new ZipEntry(fileName));
                zipOut.closeEntry();
            } else {
                zipOut.putNextEntry(new ZipEntry(fileName + "/"));
                zipOut.closeEntry();
            }
            File[] children = fileToZip.listFiles();
            for (File childFile : children) {
                zipFile(childFile, apiDefinitionsPaths, fileName + "/" + childFile.getName(), zipOut);
            }
            return;
        }

        if (isMetadataFile(fileName) || apiDefinitionsPaths.contains(fileToZip.getParent())) {
            try (FileInputStream fis = new FileInputStream(fileToZip)) {
                ZipEntry zipEntry = new ZipEntry(fileName);
                zipOut.putNextEntry(zipEntry);
                byte[] bytes = new byte[1024];
                int length;
                while ((length = fis.read(bytes)) >= 0) {
                    zipOut.write(bytes, 0, length);
                }
            }
        }
    }

    private static boolean isMetadataFile(String fileName) {
        return fileName.endsWith("metadata.yml");
    }

    public static String getRootPath(Project project) {
        return Objects.requireNonNull(project.getProjectFilePath()).split(".idea")[0];
    }


    public static MetadataDto readMetadata(Project project, Path selectFolderPath) {
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());

        VirtualFile metadataFile = ApplicationManager.getApplication().runReadAction((Computable<VirtualFile>) () -> {
            PsiFile[] files = FilenameIndex.getFilesByName(project, "metadata.yml", GlobalSearchScope.allScope(project));

            for (int i = 0; i < files.length; i++) {
                if (i == files.length - 1) {
                    return files[i].getVirtualFile();
                }
                String path = files[i].getVirtualFile().getCanonicalPath();
                assert path != null;
                String prefixPath = "";
                if (null != selectFolderPath) {
                    prefixPath = selectFolderPath.getFileName().toString();
                }
                if (path.contains(prefixPath + "/metadata.yml")) {
                    return files[i].getVirtualFile();
                }
            }
            return null;
        });

        try {
            return mapper.readValue(new File(Objects.requireNonNull(metadataFile.getCanonicalPath())), MetadataDto.class);
        } catch (IOException e) {
            throw new CustomRuntimeException(e);
        }
    }


    public static void openFile(Project project, EventRequestDto requestDto) {
        ApplicationManager.getApplication().invokeLater(() -> {
            Path pathToFile = Paths.get(requestDto.getFileName());
            PsiFile[] files = FilenameIndex.getFilesByName(project, String.valueOf(pathToFile.getFileName()), GlobalSearchScope.allScope(project));
            VirtualFile fileToOpen = null;
            for (PsiFile file : files) {
                fileToOpen = file.getVirtualFile();
                if (Paths.get(Objects.requireNonNull(fileToOpen.getCanonicalPath())).compareTo(pathToFile) == 0) {
                    break;
                }
            }

            assert fileToOpen != null;
            FileEditorManager.getInstance(project).openFile(fileToOpen, true);

            int lineNumber = requestDto.getInfoPosition().getLine() != null ? requestDto.getInfoPosition().getLine().intValue(): 0;
            int columnNumber = requestDto.getInfoPosition().getCharPosition() != null ? requestDto.getInfoPosition().getCharPosition().intValue(): 0;
            gotoLine(lineNumber, columnNumber, project);
        });
    }

    private static void gotoLine(int lineNumber, int columnNumber, Project project) {
        Editor editor = FileEditorManager.getInstance(project).getSelectedTextEditor();

        if (editor == null)
            return;

        CaretModel caretModel = editor.getCaretModel();
        int totalLineCount = editor.getDocument().getLineCount();

        if (lineNumber > totalLineCount)
            return;

        //Moving caret to line number
        caretModel.moveToLogicalPosition(new LogicalPosition(lineNumber, columnNumber));

        //Scroll to the caret
        ScrollingModel scrollingModel = editor.getScrollingModel();
        scrollingModel.scrollToCaret(ScrollType.CENTER);

    }
}
